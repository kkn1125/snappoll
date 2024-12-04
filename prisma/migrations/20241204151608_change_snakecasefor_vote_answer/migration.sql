/*
  Warnings:

  - You are about to drop the `VoteAnswer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VoteAnswer" DROP CONSTRAINT "VoteAnswer_vote_option_id_fkey";

-- DropForeignKey
ALTER TABLE "VoteAnswer" DROP CONSTRAINT "VoteAnswer_vote_response_id_fkey";

-- DropTable
DROP TABLE "VoteAnswer";

-- CreateTable
CREATE TABLE "vote_answer" (
    "id" UUID NOT NULL,
    "vote_response_id" UUID,
    "vote_option_id" UUID,
    "value" VARCHAR(100),

    CONSTRAINT "vote_answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vote_answer" ADD CONSTRAINT "vote_answer_vote_response_id_fkey" FOREIGN KEY ("vote_response_id") REFERENCES "vote_response"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_answer" ADD CONSTRAINT "vote_answer_vote_option_id_fkey" FOREIGN KEY ("vote_option_id") REFERENCES "vote_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;
