-- DropForeignKey
ALTER TABLE "board" DROP CONSTRAINT "board_user_id_fkey";

-- AlterTable
ALTER TABLE "board" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
