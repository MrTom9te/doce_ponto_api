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

/**
 * @swagger
 * tags:
 *   name: Pedidos (Gerenciamento)
 *   description: Endpoints para a confeiteira gerenciar os pedidos recebidos.
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos recebidos pela confeiteira.
 *     tags: [Pedidos (Gerenciamento)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: O número da página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: O número de itens por página.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, production, ready, delivered, cancelled]
 *         description: Filtra pedidos por um status específico.
 *     responses:
 *       '200':
 *         description: Uma lista paginada de pedidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get(
  "/",
  authMiddleware,
  async (
    req: Request<{}, {}, {}, ListOrdersParams>,
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
          error: `Status inválido. Status válidos são: ${Object.values(
            OrderStatus,
          ).join(", ")}`,
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

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtém os detalhes de um pedido específico.
 *     tags: [Pedidos (Gerenciamento)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do pedido.
 *     responses:
 *       '200':
 *         description: Detalhes do pedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '404':
 *         description: Pedido não encontrado.
 */
router.get(
  "/:id",
  authMiddleware,
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

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido.
 *     tags: [Pedidos (Gerenciamento)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do pedido a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, production, ready, delivered, cancelled]
 *                 description: O novo status do pedido.
 *     responses:
 *       '200':
 *         description: Status do pedido atualizado com sucesso.
 *       '400':
 *         description: Status inválido.
 *       '404':
 *         description: Pedido não encontrado.
 */
router.patch(
  "/:id/status",
  requireJsonContent,
  authMiddleware,
  async (
    req: Request<{ id: string }, {}, UpdateOrderStatusRequest>,
    res: Response<ApiResult<Order>>,
  ) => {
    const { id } = req.params;
    const userId = req.userId;
    const { status } = req.body;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "ID do pedido inválido",
        code: "INVALID_INPUT",
      });
    }

    if (id === "null") {
      res.status(400).json({
        success: false,
        error: "paramentro null",
        code: "NOT_NULL", // Código de erro específico da especificação
      });
    }

    if (!isOrderStatus(status)) {
      return res.status(400).json({
        success: false,
        error: `Status inválido ou não fornecido. Status válidos são: ${Object.values(
          OrderStatus,
        ).join(", ")}`,
        code: "INVALID_STATUS", // Código de erro específico da especificação
      });
    }

    try {
      const updatedOrder = await prisma.order.update({
        where: {
          id,
          userId,
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
