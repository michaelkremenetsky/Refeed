use log::error;
use s3::{creds::Credentials, Bucket, Region};
use std::env;

const DEBUG_DISABLE_IMAGE: bool = false;

pub async fn upload_to_s3(bucket_name: &str, image_hash: &str, data: &[u8]) -> String {
    if data.is_empty() {
        return String::new();
    }

    let account_id = env::var("IMAGE_ACCOUNT_ID").expect("Expected ACCOUNT_ID to be set");
    let access_key_id =
        env::var("IMAGE_ACCESS_KEY_ID").expect("Expected IMAGE_ACCESS_KEY_ID to be set");
    let secret_access_key =
        env::var("IMAGE_ACCESS_KEY_SECRET").expect("Expected IMAGE_ACCESS_KEY_SECRET to be set");

    // We use the image_hash on the frontend to check for duplicates.
    // The nano_id is because their are items with the same title and therefore hash.
    let image_key = format!("{}-{}", generate_nano_id(), image_hash);

    if !DEBUG_DISABLE_IMAGE {
        let credentials = Credentials::new(
            Some(access_key_id.as_str()),
            Some(secret_access_key.as_str()),
            None,
            None,
            None,
        )
        .unwrap();

        let bucket = Bucket::new(&bucket_name, Region::R2 { account_id }, credentials)
            .unwrap()
            .with_path_style();

        match bucket.put_object(&image_key, data).await {
            Ok(_) => (),
            Err(e) => {
                error!("Failed to upload image to S3: {:?}", e);
                return String::new();
            }
        }
    }

    match env::var("IMAGE_BUCKET_URL") {
        Ok(_) => (),
        Err(_) => {
            error!("IMAGE_BUCKET_URL environment variable not found");
        }
    };

    let url = match env::var("IMAGE_BUCKET_URL") {
        Ok(bucket_url) => format!("{}/{}", bucket_url, &image_key),
        Err(_) => {
            error!("IMAGE_BUCKET_URL environment variable not found");
            String::new()
        }
    };

    return url;
}

pub fn check_env() {
    match env::var("IMAGE_ACCOUNT_ID") {
        Ok(_) => (),
        Err(_) => {
            panic!("IMAGE_ACCOUNT_ID environment variable not found");
        }
    };
    match env::var("IMAGE_ACCESS_KEY_ID") {
        Ok(_) => (),
        Err(_) => {
            panic!("IMAGE_ACCESS_KEY_ID environment variable not found");
        }
    };
    match env::var("IMAGE_ACCESS_KEY_SECRET") {
        Ok(_) => (),
        Err(_) => {
            panic!("IMAGE_ACCESS_KEY_SECRET environment variable not found");
        }
    };
    match env::var("IMAGE_BUCKET_URL") {
        Ok(_) => (),
        Err(_) => {
            panic!("IMAGE_BUCKET_URL environment variable not found");
        }
    };
}

use nanoid::nanoid;

pub fn generate_nano_id() -> String {
    // Not using anything with a ~ or - because the has hash has to be checked on the frontend
    let alphabet: [char; 16] = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f',
    ];

    let id = nanoid!(10, &alphabet);
    return id;
}
