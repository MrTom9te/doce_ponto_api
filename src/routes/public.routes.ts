import { type Request, type Response, Router } from "express";
import moment from "moment";
import { PrismaClient } from "@/generated/prisma/client";
import { requireJsonContent } from "@/middleware/auth.middleware";
import type { ApiResult } from "@/types/api.types";
import type {
  CreateOrderRequest,
  Order,
  OrderPublicResponse,
} from "@/types/orders.types";
import type { ListParams, PaginationResponse } from "@/types/pagination.types";
import type { ProductPublic } from "@/types/products.types";
import { v4 as uuidV4 } from "uuid";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import {
  formatOrderForApi,
  formatOrderPublicForApi,
} from "@/utils/format.utils";
import { Prisma } from "@prisma/client";
import { connect } from "net";
import { abacate } from "@/services/abacate.service";

const router = Router();

const prisma = new PrismaClient();

router.get(
  "/products",
  async (
    req: Request<{}, {}, {}, ListParams>,
    res: Response<PaginationResponse<ProductPublic>>,
  ) => {
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereClause: any = {};
    whereClause.isActive = true;

    try {
      const products = await prisma.product.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.product.count({ where: whereClause });

      const productsPublic: ProductPublic[] = products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price.toNumber(), // Certifique-se de converter o Decimal do Prisma
        imageUrl: p.imageUrl,
        createdAt: p.createdAt.toISOString(),
      }));

      res.status(200).json({
        success: true,
        data: productsPublic,
        total,
        page: Number(page),
      });
    } catch (_error) {
      res.status(200).json({
        success: false,
        error: "Erro ao buscar produtos públicos",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

router.post(
  "/orders",
  requireJsonContent,
  async (
    req: Request<{}, {}, CreateOrderRequest>,
    res: Response<ApiResult<Order & { paymentUrl?: string }>>,
  ) => {
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerTaxId,
      deliveryDate,
      deliveryTime,
      productId,
      quantity,
      observations,
      address,
    } = req.body;

    // --- VALIDAÇÕES ---
    if (!customerName || customerName.length < 2 || customerName.length > 100) {
      return res.status(400).json({
        success: false,
        error:
          "Nome do cliente é obrigatório e deve ter entre 2 e 100 caracteres",
        code: "INVALID_INPUT",
      });
    }
    if (!customerPhone || !/^\d{10,11}$/.test(customerPhone)) {
      return res.status(400).json({
        success: false,
        error: "Telefone do cliente é obrigatório e deve ter 10 ou 11 dígitos",
        code: "INVALID_INPUT",
      });
    }
    if (!customerEmail || !/^[\S]+@[\S]+\.[\S]+$/.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        error: "Email do cliente é obrigatório e deve ser válido",
        code: "INVALID_INPUT",
      });
    }
    if (!customerTaxId || !/^\d{11}$/.test(customerTaxId)) {
      return res.status(400).json({
        success: false,
        error: "CPF do cliente é obrigatório e deve ter 11 dígitos",
        code: "INVALID_INPUT",
      });
    }
    if (
      !address ||
      typeof address !== "object" ||
      !address.street ||
      !address.city
    ) {
      return res.status(400).json({
        success: false,
        error: "Endereço é obrigatório e deve conter pelo menos rua e cidade.",
        code: "INVALID_INPUT",
      });
    }
    if (!productId || typeof productId !== "string") {
      return res.status(400).json({
        success: false,
        error: "ID do produto é obrigatório",
        code: "INVALID_INPUT",
      });
    }

    const orderQuantity = quantity && quantity >= 1 ? quantity : 1;

    if (!deliveryDate || !moment(deliveryDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        success: false,
        error:
          "Data de entrega é obrigatória e deve estar no formato YYYY-MM-DD",
        code: "INVALID_INPUT",
      });
    }

    const deliveryMoment = moment(deliveryDate, "YYYY-MM-DD");
    if (deliveryMoment.isBefore(moment(), "day")) {
      return res.status(400).json({
        success: false,
        error: "Data de entrega não pode ser no passado",
        code: "INVALID_INPUT",
      });
    }

    if (!deliveryTime || !/^\d{1,2}h(\d{2})?$/.test(deliveryTime)) {
      return res.status(400).json({
        success: false,
        error:
          "Hora de entrega é obrigatória e deve estar no formato '14h' ou '14h30'",
        code: "INVALID_INPUT",
      });
    }

    if (observations && observations.length > 500) {
      return res.status(400).json({
        success: false,
        error: "Observações devem ter no máximo 500 caracteres",
        code: "INVALID_INPUT",
      });
    }

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true },
        select: {
          id: true,
          name: true,
          price: true,
          userId: true,
          description: true,
        },
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          error: "Produto não encontrado ou inativo",
          code: "PRODUCT_NOT_AVAILABLE",
        });
      }

      const unitPrice = product.price.toNumber();
      const totalPrice = unitPrice * orderQuantity;

      const orderNumber = `PED-${uuidV4().substring(0, 3).toUpperCase()}-${moment().format("'YYMMDDHHmmss'")}`;

      const newOrder = await prisma.order.create({
        data: {
          orderNumber: orderNumber,
          customerName: customerName,
          customerPhone: customerPhone,
          customerEmail: customerEmail,
          customerTaxId: customerTaxId,
          productName: product.name,
          quantity: orderQuantity,
          unitPrice: product.price,
          totalPrice: new Decimal(totalPrice),
          deliveryDate: new Date(deliveryDate),
          deliveryTime: deliveryTime,
          observations: observations || "",
          status: "pending",
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          complement: address.complement,
          product: {
            connect: { id: product.id },
          },
          user: {
            connect: {
              id: product.userId,
            },
          },
        },
      });

      const billing = await abacate.billing.create({
        frequency: "ONE_TIME",
        methods: ["PIX"],
        products: [
          {
            externalId: newOrder.id,
            name: newOrder.productName,
            quantity: orderQuantity,
            price: Math.round(totalPrice * 100),
            description: product.description,
          },
        ],
        returnUrl: "http://localhost:3001/order-summary",
        completionUrl: `http://localhost:3001/order/${newOrder.id}/success`,
        customer: {
          name: customerName,
          email: customerEmail,
          cellphone: `+55${customerPhone}`,
          taxId: customerTaxId,
        },
      });

      const updatedOrderWithPayment = await prisma.order.update({
        where: { id: newOrder.id },
        data: {
          paymentProviderId: billing.data?.id,
          paymentUrl: billing.data?.url,
        },
      });

      const formattedOrder = formatOrderForApi(updatedOrderWithPayment);

      res.status(201).json({
        success: true,
        message: "Pedido criado com sucesso",
        data: {
          ...formattedOrder,
          paymentUrl: billing.data?.url,
        },
      });
    } catch (error) {
      console.log("Error ao criar pedido:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao criar pedido",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

router.get(
  "/orders/:id",

  async (req: Request<{ id: string }>, res: Response<OrderPublicResponse>) => {
    const { id } = req.params; // O 'id' pode ser UUID ou orderNumber

    // 1. Validação do ID/OrderNumber
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "ID ou número do pedido inválido",
        code: "INVALID_INPUT",
      });
    }

    try {
      let order: any;
      if (id.includes("-")) {
        order = await prisma.order.findUnique({
          where: { id: id },
        });
      }

      if (!order) {
        order = await prisma.order.findUnique({
          where: {
            orderNumber: id,
          },
        });
      }

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Pedido não encontrado",
          code: "ORDER_NOT_FOUND",
        });
      }

      const formattedPublicOrder = formatOrderPublicForApi(order);
      res.status(200).json({
        success: true,
        data: formattedPublicOrder,
      });
    } catch (error) {
      console.error("Erro ao obter status público do pedido:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao obter status do pedido",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);
export default router;
