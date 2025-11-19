-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "city" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "supportedDeliveryTypes" "DeliveryType"[] DEFAULT ARRAY['DELIVERY', 'PICKUP']::"DeliveryType"[],
ADD COLUMN     "zipCode" TEXT;
