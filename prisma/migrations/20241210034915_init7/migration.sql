/*
  Warnings:

  - Added the required column `url` to the `share_poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "share_poll" ADD COLUMN     "url" TEXT NOT NULL;
