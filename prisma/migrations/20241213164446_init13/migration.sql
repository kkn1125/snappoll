/*
  Warnings:

  - You are about to drop the `grade` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('Free', 'Hobby', 'Pro');

-- DropForeignKey
ALTER TABLE "grade" DROP CONSTRAINT "grade_user_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "grade" "Grade" NOT NULL DEFAULT 'Free';

-- DropTable
DROP TABLE "grade";

-- DropEnum
DROP TYPE "GradeType";
