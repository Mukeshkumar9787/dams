/*
  Warnings:

  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - Added the required column `stockId` to the `OrderProducts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StockType" AS ENUM ('PRODUCT', 'ORDER');

-- AlterTable
ALTER TABLE "OrderProducts" ADD COLUMN     "stockId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stock",
ADD COLUMN     "stockId" INTEGER;

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "type" "StockType" NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProducts" ADD CONSTRAINT "OrderProducts_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
