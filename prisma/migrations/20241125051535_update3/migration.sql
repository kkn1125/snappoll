-- AlterTable
ALTER TABLE "PollResult" ADD COLUMN     "user_id" UUID;

-- AddForeignKey
ALTER TABLE "PollResult" ADD CONSTRAINT "PollResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
