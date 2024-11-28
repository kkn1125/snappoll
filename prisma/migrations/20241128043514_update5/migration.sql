/*
  Warnings:

  - Added the required column `content` to the `vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `options` to the `vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vote" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "options" JSONB NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "vote_result" (
    "id" UUID NOT NULL,
    "vote_id" UUID NOT NULL,
    "answer" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vote_result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vote_result" ADD CONSTRAINT "vote_result_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "vote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
