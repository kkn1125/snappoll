/*
  Warnings:

  - Added the required column `payment_key` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "payment_key" TEXT NOT NULL;
