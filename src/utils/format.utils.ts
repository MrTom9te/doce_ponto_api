import type {
  Order,
  OrderPublic,
  OrderPublicResponse,
} from "@/types/orders.types";
import type { Product } from "@/types/products.types";

export const formatOrderForApi = (order: any): Order => ({
  id: order.id,
  orderNumber: order.orderNumber,
  customerName: order.customerName,
  customerPhone: order.customerPhone,
  productId: order.productId,
  productName: order.productName,
  quantity: order.quantity,
  unitPrice: order.unitPrice.toNumber(),
  totalPrice: order.totalPrice.toNumber(),
  deliveryDate: order.deliveryDate.toISOString().slice(0, 10),
  deliveryTime: order.deliveryTime,
  observations: order.observations,
  status: order.status,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
});
export const formatOrderPublicForApi = (order: any): OrderPublic => ({
  id: order.id,
  orderNumber: order.orderNumber,
  customerName: order.customerName,
  status: order.status,
  deliveryDate: order.deliveryDate.toISOString().slice(0, 10),
  deliveryTime: order.deliveryTime,
  updatedAt: order.updatedAt.toISOString(), // Garante formato ISO para data
});

export const formatProductForApi = (product: any): Product => ({
  ...product,
  price: product.price.toNumber(),
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});
