import { OrderStatus } from "@/generated/prisma/enums";

export function isOrderStatus(value: any): value is OrderStatus {
  return Object.values(OrderStatus).includes(value);
}
