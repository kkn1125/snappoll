/*
  Warnings:

  - A unique constraint covering the columns `[poll_id]` on the table `share_poll` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `user_profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "share_poll_poll_id_key" ON "share_poll"("poll_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");
