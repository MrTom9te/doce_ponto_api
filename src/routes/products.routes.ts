import { skip } from "@prisma/client/runtime/library";
import { type Request, type Response, Router } from "express";
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { authMiddleware } from "@/middleware/auth.middleware";
import { ApiResult } from "@/types/api.types";
import type { PaginationResponse } from "@/types/pagination.types";
import type { ListProductsParams, Product } from "@/types/products.types";

const prisma = new PrismaClient();
const router = Router();

const formatProductForApi = (product: any): Product => ({
	...product,
	price: product.price.toNumber(),
	createdAt: product.createdAt.toISOString(),
	updatedAt: product.updatedAt.toISOString(),
});

// ===============================================
//            ROTAS AUTENTICADAS
// ===============================================

// 2.1 - Listar Todos os Produtos (da confeiteira)
router.get(
	"/",
	authMiddleware,
	async (
		req: Request<{}, {}, {}, ListProductsParams>,
		res: Response<PaginationResponse<Product>>,
	) => {
		const userId = req.userId;
		const { page = 1, limit = 20, active } = req.query;

		const skip = (Number(page) - 1) * Number(limit);
		const take = Number(limit);
		const whereClause: any = { userId };
		if (active !== undefined) {
			whereClause.isActive = active === true;
		}
		try {
			const products = await prisma.product.findMany({
				where: whereClause,
				skip,
				take,
				orderBy: { createdAt: "desc" },
			});

			const total = await prisma.product.count({ where: whereClause });

			res.status(200).json({
				success: true,
				data: products.map(formatProductForApi),
				total,
				page: Number(page),
			});
		} catch (_error) {
			res
				.status(500)
				.json({
					success: false,
					error: "Erro ao buscar produtos",
					code: "INTERNAL_SERVER_ERROR",
				});
		}
	},
);
