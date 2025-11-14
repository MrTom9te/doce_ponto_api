import { type Request, type Response, Router } from "express";
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { OrderStatus } from "@/generated/prisma/enums";
import {
  authMiddleware,
  requireJsonContent,
} from "@/middleware/auth.middleware";
import type { ApiResult } from "@/types/api.types";
import type {
  ListOrdersParams,
  Order,
  UpdateOrderStatusRequest,
} from "@/types/orders.types";
import type { PaginationResponse } from "@/types/pagination.types";
import { formatOrderForApi } from "@/utils/format.utils";
import { isOrderStatus } from "@/utils/validators";

const prisma = new PrismaClient();
const router = Router();

// Função auxiliar para obter a loja do usuário
async function getStoreByUserId(userId: string) {
  if (!userId) return null;
  return prisma.store.findUnique({ where: { ownerId: userId } });
}
router.get(
  "/",
  authMiddleware,
  async (
    req: Request<{}, {}, {}, ListOrdersParams>,
    res: Response<PaginationResponse<Order>>,
  ) => {
    try {
      const store = await getStoreByUserId(req.userId!);
      if (!store) {
        return res.status(404).json({
          success: false,
          error: "Loja não encontrada para este usuário.",
          code: "STORE_NOT_FOUND",
        });
      }

      const { page = 1, limit = 20, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const whereClause: Prisma.OrderWhereInput = {
        storeId: store.id,
      };

      if (status) {
        if (isOrderStatus(status)) {
          whereClause.status = status;
        } else {
          return res.status(400).json({
            success: false,
            error: `Status inválido. Status válidos são: ${Object.values(
              OrderStatus,
            ).join(", ")}`,
            code: "INVALID_INPUT",
          });
        }
      }

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
  async (req: Request<{ id: string }>, res: Response<ApiResult<Order>>) => {
    try {
      const store = await getStoreByUserId(req.userId!);
      if (!store) {
        return res.status(404).json({
          success: false,
          error: "Loja não encontrada para este usuário.",
          code: "STORE_NOT_FOUND",
        });
      }

      const { id } = req.params;
      const order = await prisma.order.findUnique({
        where: {
          id,
          storeId: store.id,
        },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Pedido nao encontrado",
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
router.patch(
  "/:id/status",
  requireJsonContent,
  authMiddleware,
  async (
    req: Request<{ id: string }, {}, UpdateOrderStatusRequest>,
    res: Response<ApiResult<Order>>,
  ) => {
    try {
      const store = await getStoreByUserId(req.userId!);
      if (!store) {
        return res.status(404).json({
          success: false,
          error: "Loja não encontrada para este usuário.",
          code: "STORE_NOT_FOUND",
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!isOrderStatus(status)) {
        return res.status(400).json({
          success: false,
          error: `Status inválido ou não fornecido. Status válidos são: ${Object.values(
            OrderStatus,
          ).join(", ")}`,
          code: "INVALID_STATUS",
        });
      }

      const updatedOrder = await prisma.order.update({
        where: {
          id,
          storeId: store.id,
        },
        data: {
          status: status,
        },
      });
      const formattedOrder = formatOrderForApi(updatedOrder);

      res.status(200).json({
        success: true,
        message: "Status do pedido atualizado com sucesso",
        data: formattedOrder,
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({
          success: false,
          error: "Pedido não encontrado",
          code: "ORDER_NOT_FOUND",
        });
      }
      console.error("Erro ao atualizar status do pedido:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao atualizar status do pedido",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

export default router;
