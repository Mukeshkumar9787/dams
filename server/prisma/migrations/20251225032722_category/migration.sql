/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_title_deletedAt_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "deletedAt";

-- CreateIndex
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");
