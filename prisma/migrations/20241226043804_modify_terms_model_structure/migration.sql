/*
  Warnings:

  - Added the required column `title` to the `terms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "terms" ADD COLUMN     "title" VARCHAR(100) NOT NULL;
