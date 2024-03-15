#[allow(unused)]
mod prisma;

use crate::{
    feeds::{fetch_feeds, flatten_feeds},
    items::get_items,
    prisma::item,
};
use dotenv::dotenv;
use feeds::FeedWrapper;
use prisma::{feed, PrismaClient};
use prisma_client_rust::NewClientError;
use std::{error::Error, sync::Arc};
use tokio::time::Duration;
use tokio::{join, time::interval};

mod backend;
mod feeds;
mod image;
mod items;
mod types;
mod utils;

#[tokio::main]
async fn main() {
    dotenv().ok();

    utils::check_env();

    join!(backend::start_http(), start_refresh_cron());
}

async fn start_refresh_cron() {
    // Refresh every 30 minutes
    let mut interval = interval(Duration::from_secs(1800));
    loop {
        interval.tick().await;
        tokio::spawn(async move { run_refresher().await });
    }
}

async fn run_refresher() {
    let client: Result<PrismaClient, NewClientError> = PrismaClient::_builder().build().await;
    let client = Arc::new(client.unwrap());

    let feeds = client
        .feed()
        .find_many(vec![])
        .exec()
        .await
        .expect("Failed to execute query");

    let feeds = fetch_feeds(feeds).await;

    println!("Fetching {:} feeds ...", feeds.len());

    // Convert the feeds into a flat list of entries and add a feed_id to each entry
    let flat_items = flatten_feeds(&feeds);

    let items = get_items(flat_items).await;

    println!("{:?}", items.len());

    // Convert the items into a Vector of items into the format prisma expects
    let items = items
        .into_iter()
        .map(|item| {
            item::create_unchecked(
                item.title.clone(),
                item.url.clone(),
                vec![
                    item::SetParam::SetWebsiteContent(Some(item.website_content)),
                    item::SetParam::SetImageUrl(Some(item.image_url)),
                    item::SetParam::SetFeedId(Some(item.feed_id)),
                ],
            )
        })
        .collect::<Vec<_>>();

    client
        .item()
        .create_many(items)
        .skip_duplicates()
        .exec()
        .await
        .unwrap();

    println!("Caching items");

    if let Err(e) = cache_fetch_info(feeds, &client).await {
        // Handle or log the error as needed
        println!("Failed to cache fetch info: {:?}", e);
    }

    println!("Finished refresh");
}

// This takes alot to run I need to make it faster
// This can take as long as 53 seconds at times
pub async fn cache_fetch_info(
    feeds: Vec<FeedWrapper>,
    prisma: &PrismaClient,
) -> Result<(), Box<dyn Error>> {
    let feed_batches = feeds.into_iter().map(|feed| {
        prisma.feed().update(
            feed::id::equals(feed.feed_id.clone()),
            vec![
                feed::last_crawled::set(Some(feed.last_crawl_time)),
                feed::last_etag::set(feed.etag.clone()),
                feed::last_crawl_hash::set(Some(feed.last_crawl_hash)),
            ],
        )
    });

    prisma._batch(feed_batches).await?;

    Ok(())
}
