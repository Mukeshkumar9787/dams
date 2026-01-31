/*
  Warnings:

  - Made the column `stockId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "stockId" SET NOT NULL,
ALTER COLUMN "stockVersion" SET DEFAULT 1;
