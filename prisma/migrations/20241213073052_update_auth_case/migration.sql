/*
  Warnings:

  - You are about to drop the column `authProvider` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "authProvider",
ADD COLUMN     "auth_provider" "AuthProvider" NOT NULL DEFAULT 'Local';
