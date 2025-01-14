-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "subscription_id" UUID NOT NULL,
    "m_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "order_name" TEXT NOT NULL,
    "customer_key" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tax_free_amount" INTEGER NOT NULL,
    "tax_exemption_amount" INTEGER NOT NULL,
    "last_transaction_key" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "use_escrow" BOOLEAN NOT NULL,
    "culture_expense" BOOLEAN NOT NULL,
    "card_issuer_code" TEXT NOT NULL,
    "card_acquirer_code" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "card_installment_plan_months" INTEGER NOT NULL,
    "card_is_interest_free" BOOLEAN NOT NULL,
    "card_interest_payer" TEXT,
    "card_approve_no" TEXT NOT NULL,
    "use_card_point" INTEGER NOT NULL,
    "card_type" TEXT NOT NULL,
    "card_owner_type" TEXT NOT NULL,
    "card_acquire_status" TEXT NOT NULL,
    "card_amount" INTEGER NOT NULL,
    "secret" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "is_partial_cancelable" BOOLEAN NOT NULL,
    "receipt_url" TEXT,
    "checkout_url" TEXT,
    "currency" TEXT NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "balance_amount" INTEGER NOT NULL,
    "supplied_amount" INTEGER NOT NULL,
    "vat" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
