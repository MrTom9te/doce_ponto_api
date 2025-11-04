// ==================== PRODUTOS ====================

import type { ApiResult } from "./api.types";
import type { ListParams, PaginationResponse } from "./pagination.types";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPublic {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageBase64: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  imageBase64?: string;
  isActive?: boolean;
}

export interface ToggleProductRequest {
  isActive: boolean;
}

// Tipos específicos pra produtos
export type ProductsResponse = PaginationResponse<Product>;
export type ProductResponse = ApiResult<Product>;
export type ProductsPublicResponse = PaginationResponse<ProductPublic>;

export interface ListProductsParams extends ListParams {
  active?: boolean;
}
