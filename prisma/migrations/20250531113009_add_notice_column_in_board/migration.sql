/*
  Warnings:

  - You are about to drop the column `isActive` on the `terms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "board" ADD COLUMN     "is_notice" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "terms" RENAME COLUMN "isActive" TO "is_active";

-- CreateIndex
CREATE INDEX "comment_order_idx" ON "comment"("order");

-- CreateIndex
CREATE INDEX "option_order_idx" ON "option"("order");

-- CreateIndex
CREATE INDEX "vote_option_order_idx" ON "vote_option"("order");
