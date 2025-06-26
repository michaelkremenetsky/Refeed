# Refeed Core

This contains the core feed fetching and refreshing code written in rust.

## Setup Environment Variables

First, copy the `.env.example` file and create a new `.env` file:

```bash
cp .env.example .env
```

Then open .env and add the required environment variables:

```bash
env
DATABASE_URL=
IMAGE_ACCOUNT_ID=
IMAGE_ACCESS_KEY_ID=
IMAGE_ACCESS_KEY_SECRET=
IMAGE_BUCKET_URL=
```

⚠️ Make sure all values are correctly filled in before continuing.

## Generate Prisma Client

Run the following command to generate the Prisma client:

```bash
cargo prisma generate
```

This will generate the necessary client code based on your schema.

## Run the Server

To start the server, simply run:

```bash
cargo run
```

Your backend should now be running locally!
