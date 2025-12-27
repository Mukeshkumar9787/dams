-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_hsnId_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_hsnId_fkey" FOREIGN KEY ("hsnId") REFERENCES "Hsn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
