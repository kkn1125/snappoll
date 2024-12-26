/*
  Warnings:

  - You are about to drop the `AllowTerms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TermsDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AllowTerms" DROP CONSTRAINT "AllowTerms_terms_id_fkey";

-- DropForeignKey
ALTER TABLE "AllowTerms" DROP CONSTRAINT "AllowTerms_user_id_fkey";

-- DropForeignKey
ALTER TABLE "TermsDetail" DROP CONSTRAINT "TermsDetail_terms_id_fkey";

-- DropTable
DROP TABLE "AllowTerms";

-- DropTable
DROP TABLE "TermsDetail";

-- CreateTable
CREATE TABLE "allow_terms" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "terms_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "allow_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_detail" (
    "id" UUID NOT NULL,
    "terms_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terms_detail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "allow_terms_user_id_key" ON "allow_terms"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "allow_terms_terms_id_key" ON "allow_terms"("terms_id");

-- AddForeignKey
ALTER TABLE "allow_terms" ADD CONSTRAINT "allow_terms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allow_terms" ADD CONSTRAINT "allow_terms_terms_id_fkey" FOREIGN KEY ("terms_id") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms_detail" ADD CONSTRAINT "terms_detail_terms_id_fkey" FOREIGN KEY ("terms_id") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
