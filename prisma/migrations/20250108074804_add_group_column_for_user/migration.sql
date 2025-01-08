-- CreateEnum
CREATE TYPE "Group" AS ENUM ('Normal', 'Test');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "group" "Group" NOT NULL DEFAULT 'Normal';
