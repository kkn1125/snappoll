-- DropForeignKey
ALTER TABLE "option" DROP CONSTRAINT "option_question_id_fkey";

-- DropForeignKey
ALTER TABLE "question" DROP CONSTRAINT "question_poll_id_fkey";

-- DropForeignKey
ALTER TABLE "vote_option" DROP CONSTRAINT "vote_option_vote_id_fkey";

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_option" ADD CONSTRAINT "vote_option_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
