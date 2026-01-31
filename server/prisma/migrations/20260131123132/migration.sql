/*
  Warnings:

  - You are about to drop the column `stockId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_stockId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stockId";
