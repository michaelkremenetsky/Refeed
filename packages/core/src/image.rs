use std::error::Error;

use reqwest::Client;
use scraper::{Html, Selector};

pub async fn scrape_image_url(client: &Client, url: &str) -> Result<String, Box<dyn Error>> {
    let html = client.get(url).send().await?.text().await?;

    let document = Html::parse_document(&html);

    // Create a Selector for Open Graph image
    let selector = Selector::parse("meta[property='og:image']").unwrap();

    // Look for the Open Graph image tag
    // We will take file formats other than JPEG here
    if let Some(element) = document.select(&selector).next() {
        if let Some(content) = element.value().attr("content") {
            return Ok(content.to_string());
        }
    }

    // Fallback: search for any JPEG image if OG image is not found
    let img_selector = Selector::parse("img").unwrap();
    for img_element in document.select(&img_selector) {
        if let Some(src) = img_element.value().attr("src") {
            if src.ends_with(".jpg") || src.ends_with(".jpeg") || src.ends_with(".png") {
                return Ok(src.to_string());
            }
        }
    }

    Err(Box::new(std::io::Error::new(
        std::io::ErrorKind::NotFound,
        "No JPEG image found",
    )))
}

use fast_image_resize as fr;
use image::{DynamicImage, ImageFormat, ImageReader};
use std::io::Cursor;
use std::num::NonZeroU32;

pub fn optimize_image(image_data: Vec<u8>) -> Vec<u8> {
    let img = match ImageReader::new(Cursor::new(image_data)).with_guessed_format() {
        Ok(reader) => match reader.decode() {
            Ok(img) => img,
            Err(_) => return Vec::new(),
        },
        Err(_) => return Vec::new(),
    };

    let width = NonZeroU32::new(img.width()).unwrap();
    let height = NonZeroU32::new(img.height()).unwrap();

    let src_image = fr::images::Image::from_vec_u8(
        width.into(),
        height.into(),
        img.to_rgb8().into_raw(),
        fast_image_resize::PixelType::U8x3,
    )
    .unwrap();

    // Create container for data of destination image
    let dst_width = NonZeroU32::new(260).unwrap();
    let dst_height = NonZeroU32::new(156).unwrap();

    // Create destination image
    let mut dst_image =
        fr::images::Image::new(dst_width.into(), dst_height.into(), src_image.pixel_type());

    // Create Resizer instance
    let mut resizer = fr::Resizer::new();

    // Set CPU extensions
    unsafe {
        // Determine CPU extensions to use AVX2 on x86_64, default on other architectures
        let cpu_extensions = {
            #[cfg(any(target_arch = "x86", target_arch = "x86_64"))]
            {
                if is_x86_feature_detected!("avx2") {
                    fr::CpuExtensions::Avx2
                } else {
                    fr::CpuExtensions::default()
                }
            }
            #[cfg(not(any(target_arch = "x86", target_arch = "x86_64")))]
            {
                fr::CpuExtensions::default()
            }
        };

        resizer.set_cpu_extensions(cpu_extensions);
    }

    // Perform the resizing, return empty Vec on failure
    if resizer
        .resize(&src_image, &mut dst_image, &fr::ResizeOptions::default())
        .is_err()
    {
        return Vec::new();
    }
    // Convert the resized fr:image back to DynamicImage to use the 'image' crate's saving functionality
    let resized_img = match DynamicImage::ImageRgb8(
        image::RgbImage::from_raw(260, 156, dst_image.into_vec()).unwrap(),
    ) {
        img => img,
    };

    let mut output_data = Cursor::new(Vec::new());

    // Attempt to encode the resized image as JPEG, returning an empty Vec<u8> upon failure
    match resized_img.write_to(&mut output_data, ImageFormat::Jpeg) {
        Ok(_) => output_data.into_inner(),
        Err(_) => Vec::new(),
    }
}
