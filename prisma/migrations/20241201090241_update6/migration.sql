/*
  Warnings:

  - Made the column `created_by` on table `poll` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `vote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "poll" DROP CONSTRAINT "poll_created_by_fkey";

-- DropForeignKey
ALTER TABLE "vote" DROP CONSTRAINT "vote_user_id_fkey";

-- AlterTable
ALTER TABLE "poll" ALTER COLUMN "created_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "vote" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "poll" ADD CONSTRAINT "poll_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
