/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiscoveryCatergory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Filter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFeeds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "plan" AS ENUM ('free', 'pro', 'enterprise');

-- CreateEnum
CREATE TYPE "StripeSubscriptionStatus" AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Feed" DROP CONSTRAINT "Feed_DiscoveryCatergoryId_fkey";

-- DropForeignKey
ALTER TABLE "Filter" DROP CONSTRAINT "Filter_userId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_feedId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeeds" DROP CONSTRAINT "UserFeeds_feedId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeeds" DROP CONSTRAINT "UserFeeds_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserItem" DROP CONSTRAINT "UserItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "UserItem" DROP CONSTRAINT "UserItem_userId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "DiscoveryCatergory";

-- DropTable
DROP TABLE "Example";

-- DropTable
DROP TABLE "Feed";

-- DropTable
DROP TABLE "Filter";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserFeeds";

-- DropTable
DROP TABLE "UserItem";

-- DropTable
DROP TABLE "VerificationToken";

-- DropEnum
DROP TYPE "Plan";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "sharing" TEXT[] DEFAULT ARRAY['twitter', 'facebook', 'linkedin', 'email']::TEXT[],
    "default_temp_time" INTEGER NOT NULL DEFAULT 1440,
    "plan" "plan" NOT NULL DEFAULT 'free',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feed_order" JSONB,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeSubscriptionStatus" "StripeSubscriptionStatus",

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filter" (
    "id" TEXT NOT NULL,
    "filter" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT,

    CONSTRAINT "filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feeds" (
    "feed_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "feed_rename" TEXT,

    CONSTRAINT "user_feeds_pkey" PRIMARY KEY ("feed_id","user_id")
);

-- CreateTable
CREATE TABLE "feed" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "logo_url" TEXT,
    "feed_url" TEXT NOT NULL,
    "website_url" TEXT,
    "language" TEXT,
    "summary" TEXT,
    "topics" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "public" BOOLEAN,
    "last_crawled" TIMESTAMP(3),
    "last_etag" TEXT,

    CONSTRAINT "feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_item" (
    "item_id" TEXT NOT NULL,
    "in_read_later" BOOLEAN NOT NULL DEFAULT false,
    "marked_read" BOOLEAN NOT NULL,
    "marked_read_time" TIMESTAMP(3),
    "temp_added_time" TIMESTAMP(3),
    "note" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_item_pkey" PRIMARY KEY ("item_id","user_id")
);

-- CreateTable
CREATE TABLE "bookmark_folder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmark_folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmark_folder_items" (
    "folder_id" INTEGER NOT NULL,
    "item_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "bookmark_folder_items_pkey" PRIMARY KEY ("folder_id","item_id","user_id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "website_content" TEXT,
    "image_url" TEXT,
    "readibility_score" DOUBLE PRECISION,
    "content_length" INTEGER,
    "feed_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeEvent" (
    "id" TEXT NOT NULL,
    "api_version" TEXT,
    "data" JSONB NOT NULL,
    "request" JSONB,
    "type" TEXT NOT NULL,
    "object" TEXT NOT NULL,
    "account" TEXT,
    "created" TIMESTAMP(3) NOT NULL,
    "livemode" BOOLEAN NOT NULL,
    "pending_webhooks" INTEGER NOT NULL,

    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_user_id_idx" ON "user"("user_id");

-- CreateIndex
CREATE INDEX "user_feeds_feed_id_user_id_idx" ON "user_feeds"("feed_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "feed_title_key" ON "feed"("title");

-- CreateIndex
CREATE INDEX "feed_id_idx" ON "feed"("id");

-- CreateIndex
CREATE INDEX "bookmark_folder_id_idx" ON "bookmark_folder"("id");

-- CreateIndex
CREATE INDEX "bookmark_folder_user_id_idx" ON "bookmark_folder"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_folder_name_user_id_key" ON "bookmark_folder"("name", "user_id");

-- CreateIndex
CREATE INDEX "item_id_feed_id_idx" ON "item"("id", "feed_id");

-- CreateIndex
CREATE INDEX "item_title_url_readibility_score_content_length_idx" ON "item"("title", "url", "readibility_score", "content_length");

-- CreateIndex
CREATE UNIQUE INDEX "StripeEvent_id_key" ON "StripeEvent"("id");

-- AddForeignKey
ALTER TABLE "filter" ADD CONSTRAINT "filter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feeds" ADD CONSTRAINT "user_feeds_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feeds" ADD CONSTRAINT "user_feeds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_item" ADD CONSTRAINT "user_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_item" ADD CONSTRAINT "user_item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_folder" ADD CONSTRAINT "bookmark_folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_folder_items" ADD CONSTRAINT "bookmark_folder_items_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "bookmark_folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_folder_items" ADD CONSTRAINT "bookmark_folder_items_item_id_user_id_fkey" FOREIGN KEY ("item_id", "user_id") REFERENCES "user_item"("item_id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
