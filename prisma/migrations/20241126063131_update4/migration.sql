-- CreateTable
CREATE TABLE "SharePoll" (
    "id" UUID NOT NULL,
    "pollId" UUID NOT NULL,

    CONSTRAINT "SharePoll_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SharePoll" ADD CONSTRAINT "SharePoll_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
