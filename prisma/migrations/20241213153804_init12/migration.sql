/*
  Warnings:

  - You are about to alter the column `domain` on the `code` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `message` on the `error_message` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `code_domain` on the `error_message` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- DropForeignKey
ALTER TABLE "error_message" DROP CONSTRAINT "error_message_code_domain_fkey";

-- AlterTable
ALTER TABLE "code" ALTER COLUMN "domain" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "error_message" ALTER COLUMN "message" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "code_domain" SET DATA TYPE VARCHAR(100);

-- AddForeignKey
ALTER TABLE "error_message" ADD CONSTRAINT "error_message_code_domain_fkey" FOREIGN KEY ("code_domain") REFERENCES "code"("domain") ON DELETE RESTRICT ON UPDATE CASCADE;
