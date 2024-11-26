/*
  Warnings:

  - You are about to drop the `SharePoll` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SharePoll" DROP CONSTRAINT "SharePoll_pollId_fkey";

-- DropTable
DROP TABLE "SharePoll";

-- CreateTable
CREATE TABLE "user_profile" (
    "id" UUID NOT NULL,
    "image" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "share_poll" (
    "id" UUID NOT NULL,
    "poll_id" UUID NOT NULL,

    CONSTRAINT "share_poll_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_poll" ADD CONSTRAINT "share_poll_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
