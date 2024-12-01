/*
  Warnings:

  - You are about to drop the column `poll_id` on the `vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vote" DROP COLUMN "poll_id";
