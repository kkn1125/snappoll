/*
  Warnings:

  - A unique constraint covering the columns `[status]` on the table `code` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "error_message" DROP CONSTRAINT "error_message_code_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "code_status_key" ON "code"("status");

-- AddForeignKey
ALTER TABLE "error_message" ADD CONSTRAINT "error_message_status_fkey" FOREIGN KEY ("status") REFERENCES "code"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
