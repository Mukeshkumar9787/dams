-- DropIndex
DROP INDEX "ProductReview_userId_productId_key";

-- CreateIndex
CREATE INDEX "ProductReview_userId_productId_idx" ON "ProductReview"("userId", "productId");
