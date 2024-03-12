# Self Hosting via Docker

1. Clone the GitHub Repo

```sh
  git clone http://github.com/michaelkremenetsky/personal-refeed-version refeed
```

2. Change into the directory

```sh
  cd refeed
```

3. Setup Supabase via [Docker Image](https://supabase.com/docs/guides/self-hosting/docker) or using the [Hosted Platform](https://supabase.com/)
4. Run [this](https://github.com/michaelkremenetsky/Refeed/blob/main/setup/SUPABASE.sql) SQL in the Supabase SQL Editor
5. Fill out the required Environment variables:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `IMAGE_ACCOUNT_ID`
- `IMAGE_ACCESS_KEY_ID`
- `IMAGE_ACCESS_KEY_SECRET`
- `IMAGE_BUCKET_URL`
- `ICON_BUCKET_URL`

5. Build and start Refeed via docker-compose

```sh
  docker-compose up --build
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.


> [!NOTE]  
> Please note the Refeed mobile app does not support self-hosted yet. This feature will be added in the next couple of weeks
