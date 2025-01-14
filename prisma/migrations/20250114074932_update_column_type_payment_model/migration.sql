/*
  Warnings:

  - Changed the type of `use_card_point` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "use_card_point",
ADD COLUMN     "use_card_point" BOOLEAN NOT NULL;
