/*
  Warnings:

  - You are about to drop the `site_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "site_user" DROP CONSTRAINT "site_user_user_id_fkey";

-- DropTable
DROP TABLE "site_user";

-- CreateTable
CREATE TABLE "local_user" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "signup_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "local_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "local_user_user_id_key" ON "local_user"("user_id");

-- AddForeignKey
ALTER TABLE "local_user" ADD CONSTRAINT "local_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
