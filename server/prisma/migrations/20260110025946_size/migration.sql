-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sizeId" INTEGER;

-- CreateTable
CREATE TABLE "Size" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Size_title_key" ON "Size"("title");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
