-- DropForeignKey
ALTER TABLE "answer" DROP CONSTRAINT "answer_response_id_fkey";

-- DropForeignKey
ALTER TABLE "vote_answer" DROP CONSTRAINT "vote_answer_vote_response_id_fkey";

-- AlterTable
ALTER TABLE "answer" ALTER COLUMN "response_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_answer" ADD CONSTRAINT "vote_answer_vote_response_id_fkey" FOREIGN KEY ("vote_response_id") REFERENCES "vote_response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
