/*
  Warnings:

  - You are about to drop the column `like_count` on the `board` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "board" DROP COLUMN "like_count";

-- CreateTable
CREATE TABLE "board_like" (
    "id" UUID NOT NULL,
    "board_id" UUID NOT NULL,
    "user_id" UUID,

    CONSTRAINT "board_like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "board_like_board_id_user_id_key" ON "board_like"("board_id", "user_id");

-- AddForeignKey
ALTER TABLE "board_like" ADD CONSTRAINT "board_like_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_like" ADD CONSTRAINT "board_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
