/*
  Warnings:

  - You are about to drop the column `Anotations` on the `UserItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserItem" DROP COLUMN "Anotations",
ADD COLUMN     "Note" TEXT;
