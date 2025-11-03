/*
  Warnings:

  - Added the required column `productName` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "productName" TEXT NOT NULL;
