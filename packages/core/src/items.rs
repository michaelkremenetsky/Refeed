use crate::{image, types::CustomEntry, utils};
use futures::future::join_all;
use reqwest::Client;
use std::{sync::Arc, time::Duration};
use tokio::sync::Semaphore;

#[allow(dead_code)]
#[derive(Debug)]
pub struct Item {
    pub title: String,
    pub url: String,
    pub feed_id: String,
    pub website_content: String,
    pub image_url: String,
}

pub async fn get_items(items: Vec<CustomEntry>) -> Vec<Item> {
    let semaphore = Arc::new(Semaphore::new(150));
    let req_client = Client::new();

    let futures = items.into_iter().map(|item| {
        let semaphore_clone = semaphore.clone();
        let req_client = req_client.clone();
        tokio::spawn(async move {
            let _permit = semaphore_clone
                .acquire()
                .await
                .expect("Failed to acquire semaphore permit");

            let image_url = get_image_url(&req_client, &item).await;

            let data = req_client
                .get(image_url.clone())
                .timeout(Duration::from_secs(10))
                .send()
                .await;

            // Check the images
            let data = match data {
                Ok(data) => Some(data),
                Err(_) => None,
            };

            // Upload the image to S3/Cloudflare and get the image URL
            let image_url = match data {
                Some(data) => {
                    let data = data.bytes().await;

                    match data {
                        Ok(data) => {
                            let optimized_image = image::optimize_image(data.to_vec(), 75);

                            let image_hash = blake3::hash(&data).to_hex().to_string();

                            utils::upload_to_s3("images", &image_hash, optimized_image.as_ref())
                                .await
                        }
                        Err(_) => String::from(""),
                    }
                }
                None => String::from(""),
            };

            let title = match item.title {
                Some(title) => title.content,
                None => String::from(""),
            };

            let url = match item.links.get(0) {
                Some(link) => link.href.clone(),
                None => String::from(""),
            };

            // Check if the feed content exists and return an empty string if it dosen't
            let website_content = match item.content {
                Some(content) => content.body.unwrap(),
                None => String::from(""),
            };

            // If their is no content then use the summary
            let website_content = if website_content.is_empty() {
                match item.summary {
                    Some(summary) => summary.content,
                    None => String::from(""),
                }
            } else {
                website_content
            };

            Some(Item {
                title,
                image_url,
                url,
                feed_id: item.feed_id,
                website_content,
            })
        })
    });

    join_all(futures)
        .await
        .into_iter()
        .filter_map(|res| res.unwrap())
        .collect()
}

async fn get_image_url(client: &Client, entry: &CustomEntry) -> String {
    // Ensure the entry has at least one link
    if entry.links.is_empty() {
        return String::from("");
    }

    // Get the image URL
    let image_url = image::scrape_image_url(client, entry.links[0].href.as_str()).await;

    let image_url = match image_url {
        Ok(url) => url,
        Err(_) => String::from(""),
    };

    return image_url;
}
