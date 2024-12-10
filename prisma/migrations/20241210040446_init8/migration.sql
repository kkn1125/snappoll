-- AlterTable
ALTER TABLE "share_poll" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "share_vote" (
    "id" UUID NOT NULL,
    "vote_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "share_vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "share_vote_vote_id_key" ON "share_vote"("vote_id");

-- AddForeignKey
ALTER TABLE "share_vote" ADD CONSTRAINT "share_vote_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "vote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
