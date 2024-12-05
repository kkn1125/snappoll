/*
  Warnings:

  - You are about to drop the column `createdAt` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `user_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `user_profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_profile" DROP CONSTRAINT "user_profile_userId_fkey";

-- DropIndex
DROP INDEX "user_profile_userId_key";

-- AlterTable
ALTER TABLE "user_profile" DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_user_id_key" ON "user_profile"("user_id");

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
