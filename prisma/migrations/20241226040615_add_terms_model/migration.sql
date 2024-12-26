-- CreateTable
CREATE TABLE "AllowTerms" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "terms_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowTerms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms" (
    "id" UUID NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermsDetail" (
    "id" UUID NOT NULL,
    "terms_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TermsDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllowTerms_user_id_key" ON "AllowTerms"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AllowTerms_terms_id_key" ON "AllowTerms"("terms_id");

-- CreateIndex
CREATE UNIQUE INDEX "terms_version_key" ON "terms"("version");

-- AddForeignKey
ALTER TABLE "AllowTerms" ADD CONSTRAINT "AllowTerms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowTerms" ADD CONSTRAINT "AllowTerms_terms_id_fkey" FOREIGN KEY ("terms_id") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermsDetail" ADD CONSTRAINT "TermsDetail_terms_id_fkey" FOREIGN KEY ("terms_id") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
