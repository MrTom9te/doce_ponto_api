// ==================== PEDIDOS ====================

import type { ApiResult } from "./api.types";
import type { ListParams, PaginationResponse } from "./pagination.types";

export type OrderStatus =
	| "pending"
	| "confirmed"
	| "production"
	| "ready"
	| "delivered"
	| "cancelled";

export interface Order {
	id: string;
	orderNumber: string;
	customerName: string;
	customerPhone: string;
	productId: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	deliveryDate: string;
	deliveryTime: string;
	observations?: string;
	status: OrderStatus;
	createdAt: string;
	updatedAt: string;
}

export interface OrderPublic {
	id: string;
	orderNumber: string;
	customerName: string;
	status: OrderStatus;
	deliveryDate: string;
	deliveryTime: string;
	updatedAt: string;
}

export interface CreateOrderRequest {
	customerName: string;
	customerPhone: string;
	productId: string;
	quantity: number;
	deliveryDate: string;
	deliveryTime: string;
	observations?: string;
}

export interface UpdateOrderStatusRequest {
	status: OrderStatus;
}

// Tipos específicos pra pedidos
export type OrdersResponse = PaginationResponse<Order>;
export type OrderResponse = ApiResult<Order>;
export type OrderPublicResponse = ApiResult<OrderPublic>;

export interface ListOrdersParams extends ListParams {
	status?: OrderStatus;
}

// ==================== ENUMS ====================

export enum OrderStatusEnum {
	PENDING = "pending",
	CONFIRMED = "confirmed",
	PRODUCTION = "production",
	READY = "ready",
	DELIVERED = "delivered",
	CANCELLED = "cancelled",
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
	pending: "Aguardando confirmação",
	confirmed: "Confirmado",
	production: "Em produção",
	ready: "Pronto",
	delivered: "Entregue",
	cancelled: "Cancelado",
};
