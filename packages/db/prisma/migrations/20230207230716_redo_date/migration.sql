/*
  Warnings:

  - The `Temp` column on the `UserItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserItem" DROP COLUMN "Temp",
ADD COLUMN     "Temp" TIMESTAMP(3);
