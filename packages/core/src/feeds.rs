use crate::{prisma::feed::Data, types::CustomEntry};
use chrono::{FixedOffset, Utc};
use feed_rs::{
    model::Feed,
    parser::{self, ParseFeedError},
};
use futures::future::join_all;
use prisma_client_rust::serde_json;
use reqwest::{
    header::{HeaderMap, HeaderValue},
    Client,
};
use serde::Serialize;
use std::{sync::Arc, time::Duration};
use thiserror::Error;
use tokio::sync::Semaphore;

pub struct FeedWrapper {
    pub original_feed: Feed,
    pub last_crawl_hash: String,
    pub last_crawl_time: chrono::DateTime<chrono::FixedOffset>,
    pub feed_id: String,
    pub etag: Option<String>,
}

#[derive(Debug, Serialize)]
struct SerializableFeed {
    title: Option<String>,
    items: Vec<SerializableItem>,
}

#[derive(Debug, Serialize)]
struct SerializableItem {
    title: Option<String>,
    link: Option<String>,
}

#[derive(Debug, Error)]
pub enum FetchError {
    #[error("Network request failed")]
    Network(#[from] reqwest::Error),
    #[error("Failed to parse feed")]
    Parse(#[from] ParseFeedError),
    #[error("Feed has not changed")]
    NotChanged,
}

pub async fn fetch_feeds(feeds: Vec<Data>) -> Vec<FeedWrapper> {
    let semaphore = Arc::new(Semaphore::new(1000));
    let req_client = Client::new();

    let futures = feeds.into_iter().map(|feed| {
        let semaphore_clone = semaphore.clone();
        let req_client = req_client.clone();
        tokio::spawn(async move {
            let _permit = semaphore_clone
                .acquire()
                .await
                .expect("Failed to acquire semaphore permit");

            let mut headers = HeaderMap::new();

            // Set If-None-Match header if last_etag is available
            if let Some(etag) = feed.last_etag {
                headers.insert(
                    reqwest::header::IF_NONE_MATCH,
                    HeaderValue::from_str(&etag).unwrap(),
                );
            }

            // Add If-Modified-Since header if last_crawled is available
            if let Some(last_crawled) = feed.last_crawled {
                headers.insert(
                    reqwest::header::IF_MODIFIED_SINCE,
                    HeaderValue::from_str(&last_crawled.to_utc().to_rfc2822()).unwrap(),
                );
            }

            headers.insert(
                reqwest::header::USER_AGENT,
                HeaderValue::from_static("Refeed Reader/v1 (+https://www.refeed.dev/)"),
            );

            let response = req_client
                .get(&feed.feed_url)
                .headers(headers)
                .timeout(Duration::from_secs(10))
                .send()
                .await?;

            let new_etag = response
                .headers()
                .get(reqwest::header::ETAG)
                .map(|e| e.to_str().unwrap().to_string());

            let text = response.text().await?;

            let parsed = match parser::parse(text.as_bytes()) {
                Ok(parsed) => parsed,
                Err(e) => return Err(FetchError::Parse(e)),
            };

            let serializable_feed = SerializableFeed {
                title: parsed.clone().title.map(|t| t.content),
                items: parsed
                    .clone()
                    .entries
                    .into_iter()
                    .map(|item| SerializableItem {
                        title: item.title.map(|t| t.content),
                        link: item.links.first().map(|link| link.href.clone()),
                    })
                    .collect(),
            };

            let new_last_crawl_hash =
                blake3::hash(serde_json::to_vec(&serializable_feed).unwrap().as_slice())
                    .to_hex()
                    .to_string();

            let has_not_changed = feed
                .last_crawl_hash
                .as_ref()
                .map_or(false, |h| &new_last_crawl_hash == h);

            if has_not_changed {
                return Err(FetchError::NotChanged);
            }

            let utc_time = Utc::now().with_timezone(&FixedOffset::east_opt(0).unwrap());

            // Cap it at 25 items per feed per refresh
            let parsed = Feed {
                entries: parsed.entries.into_iter().take(25).collect(),
                ..parsed
            };

            Ok(FeedWrapper {
                original_feed: parsed,
                feed_id: feed.id,
                last_crawl_hash: new_last_crawl_hash,
                last_crawl_time: utc_time,
                etag: new_etag,
            })
        })
    });

    join_all(futures)
        .await
        .into_iter()
        .filter_map(|res| match res {
            Ok(Ok(feed_wrapper)) => Some(feed_wrapper),
            _ => None, // Skip ones that error
        })
        .collect()
}

pub fn flatten_feeds(feeds: &Vec<FeedWrapper>) -> Vec<CustomEntry> {
    feeds
        .into_iter()
        .map(|feed| {
            feed.original_feed
                .clone()
                .entries
                .into_iter()
                .map(move |entry| CustomEntry {
                    id: entry.id,
                    title: entry.title,
                    updated: entry.updated,
                    authors: entry.authors,
                    content: entry.content,
                    links: entry.links,
                    summary: entry.summary,
                    categories: entry.categories,
                    contributors: entry.contributors,
                    published: entry.published,
                    source: entry.source,
                    rights: entry.rights,
                    media: entry.media,
                    language: entry.language,
                    feed_id: feed.feed_id.clone(),
                })
        })
        .flatten()
        .collect()
}
