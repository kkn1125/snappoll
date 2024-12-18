/*
  Warnings:

  - Added the required column `filename` to the `user_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `user_profile` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `image` on the `user_profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user_profile" ADD COLUMN     "filename" VARCHAR(200) NOT NULL,
ADD COLUMN     "mimetype" VARCHAR(50) NOT NULL,
DROP COLUMN "image",
ADD COLUMN     "image" BYTEA NOT NULL;
