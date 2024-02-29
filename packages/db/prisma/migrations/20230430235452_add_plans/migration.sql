-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('Free', 'Pro', 'Enterprise');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Plan" "Plan" NOT NULL DEFAULT 'Free';
