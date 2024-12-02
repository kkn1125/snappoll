-- AlterTable
ALTER TABLE "poll" ALTER COLUMN "expires_at" DROP NOT NULL,
ALTER COLUMN "expires_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "vote" ALTER COLUMN "expires_at" DROP NOT NULL,
ALTER COLUMN "expires_at" DROP DEFAULT;
