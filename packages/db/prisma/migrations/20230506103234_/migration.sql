/*
  Warnings:

  - You are about to drop the column `Enabled` on the `Filter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Filter" DROP COLUMN "Enabled",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
