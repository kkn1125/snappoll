/*
  Warnings:

  - You are about to drop the `PollResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PollResult" DROP CONSTRAINT "PollResult_poll_id_fkey";

-- DropForeignKey
ALTER TABLE "PollResult" DROP CONSTRAINT "PollResult_user_id_fkey";

-- DropTable
DROP TABLE "PollResult";

-- CreateTable
CREATE TABLE "poll_result" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "poll_id" UUID,
    "answer" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "poll_result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "poll_result" ADD CONSTRAINT "poll_result_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_result" ADD CONSTRAINT "poll_result_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
