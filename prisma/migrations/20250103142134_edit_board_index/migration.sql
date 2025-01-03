-- DropIndex
DROP INDEX "board_like_board_id_user_id_key";

-- CreateIndex
CREATE INDEX "board_like_user_id_idx" ON "board_like"("user_id");

-- CreateIndex
CREATE INDEX "board_like_board_id_idx" ON "board_like"("board_id");
