-- CreateEnum
CREATE TYPE "NoticeType" AS ENUM ('Normal', 'Batch');

-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "receive_mail" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Notice" (
    "id" UUID NOT NULL,
    "type" "NoticeType" NOT NULL DEFAULT 'Normal',
    "cover" TEXT,
    "title" VARCHAR(30) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);
