/*
  Warnings:

  - A unique constraint covering the columns `[orderAccessCode]` on the table `pedidos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "anonId" TEXT,
ADD COLUMN     "orderAccessCode" TEXT;

-- CreateTable
CREATE TABLE "anonymous_sessions" (
    "id" TEXT NOT NULL,
    "tokenVersion" INTEGER NOT NULL DEFAULT 1,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "anonymous_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_orderAccessCode_key" ON "pedidos"("orderAccessCode");
