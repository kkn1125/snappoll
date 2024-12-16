-- DropForeignKey
ALTER TABLE "error_message" DROP CONSTRAINT "error_message_code_domain_fkey";

-- AddForeignKey
ALTER TABLE "error_message" ADD CONSTRAINT "error_message_code_domain_fkey" FOREIGN KEY ("code_domain") REFERENCES "code"("domain") ON DELETE CASCADE ON UPDATE CASCADE;
