/*
  Warnings:

  - You are about to drop the column `code_id` on the `error_message` table. All the data in the column will be lost.
  - Added the required column `code_status` to the `error_message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "error_message" DROP CONSTRAINT "error_message_status_fkey";

-- AlterTable
ALTER TABLE "error_message" DROP COLUMN "code_id",
ADD COLUMN     "code_status" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "error_message" ADD CONSTRAINT "error_message_code_status_fkey" FOREIGN KEY ("code_status") REFERENCES "code"("status") ON DELETE RESTRICT ON UPDATE CASCADE;
