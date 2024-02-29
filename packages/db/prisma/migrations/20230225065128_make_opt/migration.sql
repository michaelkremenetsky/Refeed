-- DropForeignKey
ALTER TABLE "Feed" DROP CONSTRAINT "Feed_DiscoveryCatergoryId_fkey";

-- AlterTable
ALTER TABLE "Feed" ALTER COLUMN "DiscoveryCatergoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_DiscoveryCatergoryId_fkey" FOREIGN KEY ("DiscoveryCatergoryId") REFERENCES "DiscoveryCatergory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
