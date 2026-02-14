/*
  Warnings:

  - A unique constraint covering the columns `[orderId,status]` on the table `OrderStatusHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderStatusHistory_orderId_status_key" ON "OrderStatusHistory"("orderId", "status");
