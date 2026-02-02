/*
  Warnings:

  - You are about to drop the column `stockVersion` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stockId]` on the table `OrderProducts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stockVersion";

-- CreateIndex
CREATE UNIQUE INDEX "OrderProducts_stockId_key" ON "OrderProducts"("stockId");
