/*
  Warnings:

  - You are about to alter the column `title` on the `poll` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to drop the column `content` on the `vote` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `vote` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - The primary key for the `vote_option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `option_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `poll_option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `poll_result` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vote_result` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `vote_option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `vote_option` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `vote_option` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `vote_id` on table `vote_option` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "option_item" DROP CONSTRAINT "option_item_poll_option_id_fkey";

-- DropForeignKey
ALTER TABLE "option_item" DROP CONSTRAINT "option_item_vote_option_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_option" DROP CONSTRAINT "poll_option_poll_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_result" DROP CONSTRAINT "poll_result_poll_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_result" DROP CONSTRAINT "poll_result_user_id_fkey";

-- DropForeignKey
ALTER TABLE "vote_option" DROP CONSTRAINT "vote_option_vote_id_fkey";

-- AlterTable
ALTER TABLE "poll" ALTER COLUMN "title" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vote" DROP COLUMN "content",
ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "vote_option" DROP CONSTRAINT "vote_option_pkey",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "value" VARCHAR(100) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "vote_id" SET NOT NULL,
ADD CONSTRAINT "vote_option_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "option_item";

-- DropTable
DROP TABLE "poll_option";

-- DropTable
DROP TABLE "poll_result";

-- DropTable
DROP TABLE "vote_result";

-- CreateTable
CREATE TABLE "question" (
    "id" UUID NOT NULL,
    "poll_id" UUID NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'input',
    "title" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "order" INTEGER,
    "is_multiple" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "poll_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer" (
    "id" UUID NOT NULL,
    "response_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "option_id" UUID,
    "value" VARCHAR(100),

    CONSTRAINT "answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "id" UUID NOT NULL,
    "vote_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_response" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "vote_id" UUID NOT NULL,
    "vote_option_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vote_response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response" ADD CONSTRAINT "response_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response" ADD CONSTRAINT "response_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_response" ADD CONSTRAINT "vote_response_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_response" ADD CONSTRAINT "vote_response_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "vote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_option" ADD CONSTRAINT "vote_option_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "vote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
