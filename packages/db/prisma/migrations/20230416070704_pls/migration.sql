/*
  Warnings:

  - You are about to drop the column `BookmarkFolder` on the `UserItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "TempTime" SET DEFAULT 1440;

-- AlterTable
ALTER TABLE "UserItem" DROP COLUMN "BookmarkFolder";
