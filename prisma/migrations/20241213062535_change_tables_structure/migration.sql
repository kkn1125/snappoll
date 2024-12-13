/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "GradeType" AS ENUM ('Free', 'Hobby', 'Pro');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('Local', 'Kakao', 'Google');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "password",
ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT 'Local',
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';

-- AlterTable
ALTER TABLE "user_profile" ALTER COLUMN "image" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "error_message" (
    "id" SERIAL NOT NULL,
    "code_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "error_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code" (
    "id" SERIAL NOT NULL,
    "status" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "grade_type" "GradeType" NOT NULL DEFAULT 'Free',

    CONSTRAINT "grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_user" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "social_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_user" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "signup_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grade_user_id_key" ON "grade"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "social_user_user_id_key" ON "social_user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_user_user_id_key" ON "site_user"("user_id");

-- AddForeignKey
ALTER TABLE "error_message" ADD CONSTRAINT "error_message_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "code"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_user" ADD CONSTRAINT "social_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_user" ADD CONSTRAINT "site_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
