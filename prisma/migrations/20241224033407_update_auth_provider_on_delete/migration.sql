-- DropForeignKey
ALTER TABLE "local_user" DROP CONSTRAINT "local_user_user_id_fkey";

-- DropForeignKey
ALTER TABLE "social_user" DROP CONSTRAINT "social_user_user_id_fkey";

-- AddForeignKey
ALTER TABLE "social_user" ADD CONSTRAINT "social_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local_user" ADD CONSTRAINT "local_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
