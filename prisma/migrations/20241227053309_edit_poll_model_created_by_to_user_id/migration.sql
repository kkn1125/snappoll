/*
  Warnings:

  - You are about to drop the column `created_by` on the `poll` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `poll` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "poll" DROP CONSTRAINT "poll_created_by_fkey";

-- AlterTable
ALTER TABLE "poll" DROP COLUMN "created_by",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "poll" ADD CONSTRAINT "poll_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
