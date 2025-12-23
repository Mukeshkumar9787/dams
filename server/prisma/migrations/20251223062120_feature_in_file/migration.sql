-- CreateEnum
CREATE TYPE "Feature" AS ENUM ('CATEGORY', 'PRODUCT');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "feature" "Feature",
ADD COLUMN     "featureId" INTEGER;
