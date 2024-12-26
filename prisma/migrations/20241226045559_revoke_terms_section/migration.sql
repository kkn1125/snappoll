/*
  Warnings:

  - You are about to drop the `terms_detail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "terms_detail" DROP CONSTRAINT "terms_detail_terms_id_fkey";

-- DropTable
DROP TABLE "terms_detail";

-- CreateTable
CREATE TABLE "terms_section" (
    "id" UUID NOT NULL,
    "terms_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terms_section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "terms_section" ADD CONSTRAINT "terms_section_terms_id_fkey" FOREIGN KEY ("terms_id") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
