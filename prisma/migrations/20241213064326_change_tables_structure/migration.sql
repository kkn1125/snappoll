/*
  Warnings:

  - Added the required column `status` to the `error_message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "error_message" ADD COLUMN     "status" INTEGER NOT NULL;
