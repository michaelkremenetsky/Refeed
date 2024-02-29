use chrono::{DateTime, Utc};
use feed_rs::model::{Category, Content, Link, MediaObject, Person, Text};

// feed-rs Entry struct with feed_id added
pub struct CustomEntry {
    pub id: String,
    pub title: Option<Text>,
    pub updated: Option<DateTime<Utc>>,
    pub authors: Vec<Person>,
    pub content: Option<Content>,
    pub links: Vec<Link>,
    pub summary: Option<Text>,
    pub categories: Vec<Category>,
    pub contributors: Vec<Person>,
    pub published: Option<DateTime<Utc>>,
    pub source: Option<String>,
    pub rights: Option<Text>,
    pub media: Vec<MediaObject>,
    pub language: Option<String>,
    pub feed_id: String,
}
