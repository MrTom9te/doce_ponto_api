import type { Order } from "@/types/orders.types";
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
	deliveryDate: order.deliveryDate,
	deliveryTime: order.deliveryTime,
	observations: order.observations,
	status: order.status,
	createdAt: order.createdAt.toISOString(),
	updatedAt: order.updatedAt.toISOString(),
});

export const formatProductForApi = (product: any): Product => ({
	...product,
	price: product.price.toNumber(),
	createdAt: product.createdAt.toISOString(),
	updatedAt: product.updatedAt.toISOString(),
});
