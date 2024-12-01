/*
  Warnings:

  - Added the required column `content` to the `option` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "option" ADD COLUMN     "content" VARCHAR(150) NOT NULL;
