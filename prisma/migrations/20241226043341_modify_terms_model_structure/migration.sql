/*
  Warnings:

  - You are about to drop the `terms_detail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `terms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "terms_detail" DROP CONSTRAINT "terms_detail_terms_id_fkey";

-- AlterTable
ALTER TABLE "terms" ADD COLUMN     "content" TEXT NOT NULL;

-- DropTable
DROP TABLE "terms_detail";
