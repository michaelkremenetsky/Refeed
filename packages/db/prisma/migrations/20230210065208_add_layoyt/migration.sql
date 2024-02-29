/*
  Warnings:

  - You are about to drop the column `Theme` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Theme",
ADD COLUMN     "Layout" TEXT;
