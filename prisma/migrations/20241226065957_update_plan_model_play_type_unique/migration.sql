/*
  Warnings:

  - A unique constraint covering the columns `[plan_type]` on the table `plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "plan_plan_type_key" ON "plan"("plan_type");
