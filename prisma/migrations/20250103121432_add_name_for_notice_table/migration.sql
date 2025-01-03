/*
  Warnings:

  - You are about to drop the `Notice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Notice";

-- CreateTable
CREATE TABLE "notice" (
    "id" UUID NOT NULL,
    "type" "NoticeType" NOT NULL DEFAULT 'Normal',
    "cover" TEXT,
    "title" VARCHAR(30) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notice_pkey" PRIMARY KEY ("id")
);
