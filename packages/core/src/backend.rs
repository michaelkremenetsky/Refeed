use std::sync::Arc;

use crate::{
    cache_fetch_info,
    feeds::flatten_feeds,
    fetch_feeds, get_items,
    prisma::{feed, item, PrismaClient},
};
use axum::{extract::Json, http::Uri, routing::post};
use axum::{routing::get, Router};
use prisma_client_rust::NewClientError;
use serde::Deserialize;
use tower_http::cors::CorsLayer;

pub async fn start_http() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/refreshfeeds", post(refreshfeeds))
        .route("/healthcheck", get(healthcheck))
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4050")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[derive(Deserialize, Debug)]
struct RefreshFeedsRequest {
    feed_ids: Vec<String>,
}

async fn refreshfeeds(Json(request): Json<RefreshFeedsRequest>) {
    println!("{:?}", request.feed_ids);
    println!("{:?}", request.feed_ids.len());

    let client: Result<PrismaClient, NewClientError> = PrismaClient::_builder().build().await;
    let client = Arc::new(client.unwrap());

    let feeds = client
        .feed()
        .find_many(vec![feed::id::in_vec(request.feed_ids)])
        .exec()
        .await
        .expect("Failed to execute query");

    println!("{:?}", feeds);

    let feeds = fetch_feeds(feeds).await;

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
                item.feed_id.clone(),
                vec![
                    item::SetParam::SetWebsiteContent(Some(item.website_content)),
                    item::SetParam::SetImageUrl(Some(item.image_url)),
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

    // Cache the fetch info in the background to return the response faster
    tokio::spawn(async move {
        // Execute caching in the background
        if let Err(e) = cache_fetch_info(feeds, &client).await {
            // Handle or log the error as needed
            println!("Failed to cache fetch info: {:?}", e);
        }
    });

    println!("Finished refresh");
}

async fn healthcheck(uri: Uri) -> &'static str {
    println!("The request is: {}", uri);
    println!("{:?}", "I'm healthy");

    "Hello world"
}
