import { type Request, type Response, Router } from "express";
import { type Prisma, PrismaClient } from "@/generated/prisma/client";
import { OrderStatus } from "@/generated/prisma/enums";
import {
  authMiddleware,
  requireJsonContent,
} from "@/middleware/auth.middleware";
import type { ListOrdersParams, Order } from "@/types/orders.types";
import type { PaginationResponse } from "@/types/pagination.types";
import { formatOrderForApi } from "@/utils/format.utils";
import { isOrderStatus } from "@/utils/validators";
import { ApiResult } from "@/types/api.types";
import { v4 } from "uuid";

const prisma = new PrismaClient();
const router = Router();

router.get(
  "/",
  authMiddleware,
  async (
    req: Request<{}, {}, ListOrdersParams>,
    res: Response<PaginationResponse<Order>>,
  ) => {
    const userId = req.userId;
    const { page = 1, limit = 20, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereClause: Prisma.OrderWhereInput = {
      userId: userId,
    };

    if (status) {
      if (isOrderStatus(status)) {
        whereClause.status = status;
      } else {
        return res.status(400).json({
          success: false,
          error: `Status inválido. Status válidos são: ${Object.values(OrderStatus).join(", ")}`,
          code: "INVALID_INPUT",
        });
      }
    }

    try {
      const orders = await prisma.order.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.order.count({
        where: whereClause,
      });

      const formattedOrders = orders.map(formatOrderForApi);
      res.status(200).json({
        success: true,
        data: formattedOrders,
        total,
        page: Number(page),
      });
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao listar pedidos",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

router.get(
  "/:id",
  authMiddleware,
  requireJsonContent,
  async (req: Request<{ id: string }>, res: Response<ApiResult<Order>>) => {
    const { id } = req.params;
    const userId = req.userId;
    try {
      const order = await prisma.order.findUnique({
        where: {
          id,
          userId,
        },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "PEdido nao encontrado",
          code: "ORDER_NOT_FOUND",
        });
      }

      const formattedOrder = formatOrderForApi(order);
      res.status(200).json({
        success: true,
        data: formattedOrder,
      });
    } catch (error) {
      console.error("Erro ao obter detalhes do pedido:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao obter detalhes do pedido",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

export default router;
