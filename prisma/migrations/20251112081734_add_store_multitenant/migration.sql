/*
  Warnings:

  - You are about to drop the column `userId` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `produtos` table. All the data in the column will be lost.
  - Added the required column `storeId` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pedidos" DROP CONSTRAINT "pedidos_userId_fkey";

-- DropForeignKey
ALTER TABLE "produtos" DROP CONSTRAINT "produtos_userId_fkey";

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "userId",
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "produtos" DROP COLUMN "userId",
ADD COLUMN     "storeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "logoUrl" TEXT,
    "themeColor" TEXT DEFAULT '#8A2BE2',
    "layoutStyle" TEXT DEFAULT 'grid',
    "fontFamily" TEXT DEFAULT 'Inter',

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "stores_ownerId_key" ON "stores"("ownerId");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
