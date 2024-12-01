/*
  Warnings:

  - You are about to drop the column `vote_id` on the `option` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `vote_option` table. All the data in the column will be lost.
  - Added the required column `content` to the `vote_option` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "option" DROP COLUMN "vote_id";

-- AlterTable
ALTER TABLE "vote_option" DROP COLUMN "value",
ADD COLUMN     "content" VARCHAR(100) NOT NULL;
