-- CreateEnum
CREATE TYPE "OTP_Types" AS ENUM ('LOGIN', 'REGISTER', 'RESET_PASSWORD');

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "type" "OTP_Types" NOT NULL,
    "email" TEXT,
    "userId" INTEGER,
    "otp" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_otp_key" ON "Otp"("otp");

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
