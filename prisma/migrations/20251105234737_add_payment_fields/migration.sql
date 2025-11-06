/*
  Warnings:

  - A unique constraint covering the columns `[paymentProviderId]` on the table `pedidos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentUrl]` on the table `pedidos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "paymentProviderId" TEXT,
ADD COLUMN     "paymentUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_paymentProviderId_key" ON "pedidos"("paymentProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_paymentUrl_key" ON "pedidos"("paymentUrl");
