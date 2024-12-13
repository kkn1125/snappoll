/*
  Warnings:

  - A unique constraint covering the columns `[domain]` on the table `code` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "error_message" DROP CONSTRAINT "error_message_code_status_fkey";

-- AlterTable
ALTER TABLE "error_message" ALTER COLUMN "code_status" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "code_domain_key" ON "code"("domain");

-- AddForeignKey
ALTER TABLE "error_message" ADD CONSTRAINT "error_message_code_status_fkey" FOREIGN KEY ("code_status") REFERENCES "code"("domain") ON DELETE RESTRICT ON UPDATE CASCADE;
