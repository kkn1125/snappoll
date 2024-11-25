-- DropForeignKey
ALTER TABLE "vote" DROP CONSTRAINT "vote_poll_id_fkey";

-- CreateTable
CREATE TABLE "PollResult" (
    "id" UUID NOT NULL,
    "poll_id" UUID,
    "answer" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PollResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PollResult" ADD CONSTRAINT "PollResult_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;
