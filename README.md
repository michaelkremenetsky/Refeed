# Refeed
[Refeed Reader](https://refeedreader.com/) is an open source RSS Reader. With Refeed, you can easily organize and read your favorite websites, blogs, and news sources in one place, saving you time and effort in staying up-to-date with the content that matters most to you.

<a href="https://refeedreader.com">
  <div align="center">
    <img alt="Refeed - An Open Source RSS Reader for the modern human" width={1344} height={696} src="https://github.com/michaelkremenetsky/Refeed/blob/main/apps/web/public/Hero.png">
  </div>
</a>

# Key Features

- <strong>Timed Bookmarks: </strong> The "Time Bookmark" feature is designed to declutter your bookmarks by automatically removing them after a preset amount of time, ensuring your reading list is filled only with bookmarks that you actually come back to later.
- <strong>Filters: </strong> Automatically remove content that matches certain criteria, such as specific keywords, authors, or publication dates. By filtering out articles that don't align with your interests or needs, this tool helps declutter your feed, ensuring a more focused and relevant reading experience.
- <strong>Bookmark Folders: </strong> Organize your bookmarks for easy retrieval and management. Dive back into your saved content with intuitive navigation. Find what you're looking for, whether it's for reference, rereading, or relaxation, in just a couple of clicks.
- <strong>Notes: </strong> Seamlessly jot down your insights, ideas, and reflections as you read. Whether it's "Inspiration," "To-Do," or "Deep Dive," keep your thoughts well-organized and accessible.
- <strong>Mark Read on Scroll: </strong> Automatically mark articles as read as you scroll through them, ensuring a seamless and efficient reading flow.
- <strong>Inbox</strong> Receive a custom email address for newsletter subscriptions without ever cluttering your personal inbox. Use your Refeed email to subscribe to your favorite newsletters. We'll automatically convert them into RSS feeds, directly accessible within Refeed.
- <strong>Fullscreen Reading Mode: </strong> Immerse yourself in your articles with a fullscreen mode, eliminating distractions and focusing solely on the content
- <strong>Note-Taking: </strong> Take notes directly on articles to capture your thoughts, ideas, or action items.
- <strong>Full Content Fetching: </strong> Access the full content of websites right within the Reader.

## Development

1. Clone the repo
   ```sh
   git clone https://github.com/michaelkremenetsky/refeed.git
   ```
2. Go to the project folder
   ```sh
   cd refeed
   ```
3. Install packages with `pnpm`
   ```sh
   pnpm
   ```
4. Setup env

   - Duplicate `.env.example` to `.env`

5. Setup Supabase via [Docker Image](https://supabase.com/docs/guides/self-hosting/docker) or using the [Hosted Platform](https://supabase.com/)

6. Run [this](https://github.com/michaelkremenetsky/Refeed/blob/main/setup/SUPABASE.sql) SQL in the Supabase SQL Editor

7. Run `pnpm db:push`

## Self Hosting with Docker

Want to use Docker?
See [Docker Setup](setup/SELFHOSTING.md)

### Built With

- [Next.js](https://nextjs.org/?ref=refeedreader.com)
- [tRPC](https://trpc.io/?ref=refeedreader.com)
- [React](https://reactjs.org/?ref=refeedreader.com)
- [React Native](https://reactnative.dev/?ref=refeedreader.com)
- [Expo](https://expo.dev/?ref=refeedreader.com)
- [Tailwind CSS](https://tailwindcss.com/?ref=refeedreader.com)
- [Prisma](https://prisma.io/?ref=refeedreader.com)
- [Turborepo](https://turborepo.org/?ref=refeedreader.com)
- [Supabase](https://supabase.com/?ref=refeedreader.com)

# Contributing
Contributions are welcome and appreciated.

# Contact
You can contact us at michaelkremenetsky@refeed.dev
