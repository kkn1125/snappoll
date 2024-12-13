/*
  Warnings:

  - You are about to drop the column `code_status` on the `error_message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code_domain]` on the table `error_message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code_domain` to the `error_message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "error_message" DROP CONSTRAINT "error_message_code_status_fkey";

-- AlterTable
ALTER TABLE "error_message" DROP COLUMN "code_status",
ADD COLUMN     "code_domain" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "error_message_code_domain_key" ON "error_message"("code_domain");

-- AddForeignKey
ALTER TABLE "error_message" ADD CONSTRAINT "error_message_code_domain_fkey" FOREIGN KEY ("code_domain") REFERENCES "code"("domain") ON DELETE RESTRICT ON UPDATE CASCADE;
