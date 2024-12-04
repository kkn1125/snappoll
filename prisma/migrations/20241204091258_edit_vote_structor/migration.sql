/*
  Warnings:

  - You are about to drop the column `value` on the `vote_response` table. All the data in the column will be lost.
  - You are about to drop the column `vote_option_id` on the `vote_response` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vote_response" DROP COLUMN "value",
DROP COLUMN "vote_option_id";

-- CreateTable
CREATE TABLE "VoteAnswer" (
    "id" UUID NOT NULL,
    "vote_response_id" UUID,
    "vote_option_id" UUID,
    "value" VARCHAR(100),

    CONSTRAINT "VoteAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VoteAnswer" ADD CONSTRAINT "VoteAnswer_vote_response_id_fkey" FOREIGN KEY ("vote_response_id") REFERENCES "vote_response"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteAnswer" ADD CONSTRAINT "VoteAnswer_vote_option_id_fkey" FOREIGN KEY ("vote_option_id") REFERENCES "vote_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;
