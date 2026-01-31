/*
  Warnings:

  - Made the column `stockId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stockVersion" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "stockId" SET NOT NULL;
