-- AlterTable
ALTER TABLE "vote_response" ADD COLUMN     "value" VARCHAR(100),
ALTER COLUMN "vote_option_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "board" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "order" INTEGER,
    "category" VARCHAR(50) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isOnlyCrew" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "board_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
