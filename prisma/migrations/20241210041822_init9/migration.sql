/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `share_poll` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `share_vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "share_poll_url_key" ON "share_poll"("url");

-- CreateIndex
CREATE UNIQUE INDEX "share_vote_url_key" ON "share_vote"("url");
