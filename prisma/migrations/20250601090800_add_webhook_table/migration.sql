-- CreateTable
CREATE TABLE "webhook" (
    "id" SERIAL NOT NULL,
    "domain" VARCHAR(100) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "webhook_url" VARCHAR(300) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "webhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webhook_webhook_url_key" ON "webhook"("webhook_url");

-- CreateIndex
CREATE INDEX "webhook_webhook_url_idx" ON "webhook"("webhook_url");
