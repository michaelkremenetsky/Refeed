/*
  Warnings:

  - A unique constraint covering the columns `[title,url]` on the table `item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "feed" ADD COLUMN     "last_crawl_hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "item_title_url_key" ON "item"("title", "url");
