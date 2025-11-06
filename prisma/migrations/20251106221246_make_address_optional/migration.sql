/*
  Warnings:

  - Added the required column `customerEmail` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerTaxId` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('DELIVERY', 'PICKUP');

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "city" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerTaxId" TEXT NOT NULL,
ADD COLUMN     "deliveryType" "DeliveryType" NOT NULL DEFAULT 'PICKUP',
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "zipCode" TEXT;
