/*
  Warnings:

  - You are about to drop the column `isOnlyCrew` on the `board` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `board` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `board` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "board" DROP COLUMN "isOnlyCrew",
DROP COLUMN "isPrivate",
DROP COLUMN "viewCount",
ADD COLUMN     "is_only_crew" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;
