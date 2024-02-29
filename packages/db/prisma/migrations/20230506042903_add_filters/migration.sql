-- CreateTable
CREATE TABLE "Filter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "filter" JSONB NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
