-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "colorId" INTEGER;

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_title_key" ON "Color"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Color_code_key" ON "Color"("code");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
