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
use image::{io::Reader as ImageReader, DynamicImage, ImageOutputFormat};
use std::io::Cursor;
use std::num::NonZeroU32;

pub fn optimize_image(image_data: Vec<u8>, quality: u8) -> Vec<u8> {
    let img = match ImageReader::new(Cursor::new(image_data)).with_guessed_format() {
        Ok(reader) => match reader.decode() {
            Ok(img) => img,
            Err(_) => return Vec::new(),
        },
        Err(_) => return Vec::new(),
    };

    let width = NonZeroU32::new(img.width()).unwrap();
    let height = NonZeroU32::new(img.height()).unwrap();

    let src_image = fr::Image::from_vec_u8(
        width,
        height,
        img.to_rgb8().into_raw(),
        fast_image_resize::PixelType::U8x3,
    )
    .unwrap();

    // Create container for data of destination image
    let dst_width = NonZeroU32::new(260).unwrap();
    let dst_height = NonZeroU32::new(156).unwrap();
    let mut dst_image = fr::Image::new(dst_width, dst_height, src_image.pixel_type());

    // Get mutable view of destination image data
    let mut dst_view = dst_image.view_mut();

    // Create Resizer instance and resize source image into buffer of destination image
    let mut resizer = fr::Resizer::new(fr::ResizeAlg::Convolution(fr::FilterType::Lanczos3));

    // Make sure its set to avx2
    unsafe {
        resizer.set_cpu_extensions(fr::CpuExtensions::Avx2);
    }

    // Perform the resizing, return empty Vec on failure
    if resizer.resize(&src_image.view(), &mut dst_view).is_err() {
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
    match resized_img.write_to(&mut output_data, ImageOutputFormat::Jpeg(quality)) {
        Ok(_) => output_data.into_inner(),
        Err(_) => Vec::new(),
    }
}
