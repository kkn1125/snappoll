/*
  Warnings:

  - You are about to drop the column `content` on the `terms` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `terms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "terms" DROP COLUMN "content",
DROP COLUMN "title";

-- CreateTable
CREATE TABLE "terms_detail" (
    "id" UUID NOT NULL,
    "terms_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terms_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "terms_detail" ADD CONSTRAINT "terms_detail_terms_id_fkey" FOREIGN KEY ("terms_id") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
