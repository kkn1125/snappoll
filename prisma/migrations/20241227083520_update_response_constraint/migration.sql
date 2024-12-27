-- DropForeignKey
ALTER TABLE "response" DROP CONSTRAINT "response_poll_id_fkey";

-- DropForeignKey
ALTER TABLE "vote_response" DROP CONSTRAINT "vote_response_vote_id_fkey";

-- AddForeignKey
ALTER TABLE "response" ADD CONSTRAINT "response_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_response" ADD CONSTRAINT "vote_response_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
