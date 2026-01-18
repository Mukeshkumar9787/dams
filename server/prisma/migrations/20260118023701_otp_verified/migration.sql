-- DropIndex
DROP INDEX "Otp_otp_key";

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "verifiedAt" TIMESTAMP(3);
