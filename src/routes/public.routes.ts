import { type Request, type Response, Router } from "express";
import moment from "moment";
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { requireJsonContent } from "@/middleware/auth.middleware";
import { anonSessionMiddleware } from "@/middleware/anon.middleware";
import { parseCookies } from "@/middleware/anon.middleware";
import jwt from "jsonwebtoken";
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
import { createPixQrCodeRest } from "@/services/abacate.service";

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
    // Exibir apenas produtos de lojas ativas
    whereClause.store = { isActive: true };

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

// Listar lojas públicas ativas
router.get(
  "/stores",
  async (
    req: Request<{}, {}, {}, ListParams>,
    res: Response<PaginationResponse<any>>,
  ) => {
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    try {
      const [stores, total] = await Promise.all([
        prisma.store.findMany({
          where: { isActive: true },
          skip,
          take,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            themeColor: true,
            layoutStyle: true,
            fontFamily: true,
            city: true,
            state: true,
            isOpen: true,
          },
        }),
        prisma.store.count({ where: { isActive: true } }),
      ]);
    
      res.status(200).json({ success: true, data: stores, total, page: Number(page) });
    } catch (error) {
      console.error("Erro ao listar lojas públicas:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar lojas públicas",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

// Dados públicos de uma loja por slug
router.get(
  "/loja/:slug",
  async (req: Request<{ slug: string }>, res: Response<ApiResult<any>>) => {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        success: false,
        error: "Slug inválido",
        code: "INVALID_INPUT",
      });
    }
    try {
      const store = await prisma.store.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          themeColor: true,
          layoutStyle: true,
          fontFamily: true,
          city: true,
          state: true,
          isOpen: true,
          isActive: true,
          openingHours: true,
        },
      });
      if (!store || !store.isActive) {
        return res.status(404).json({
          success: false,
          error: "Loja não encontrada",
          code: "STORE_NOT_FOUND",
        });
      }
      res.status(200).json({ success: true, data: store });
    } catch (error) {
      console.error("Erro ao obter loja pública:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

// Produtos de uma loja específica (por slug)
router.get(
  "/loja/:slug/products",
  async (
    req: Request<{ slug: string }, {}, {}, ListParams>,
    res: Response<PaginationResponse<ProductPublic>>, 
  ) => {
    const { slug } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: "Slug inválido",
        code: "INVALID_INPUT",
      });
    }

    try {
      const store = await prisma.store.findUnique({ where: { slug }, select: { id: true, isActive: true } });
      if (!store || !store.isActive) {
        return res.status(404).json({
          success: false,
          error: "Loja não encontrada",
          code: "STORE_NOT_FOUND",
        });
      }

      const whereProducts: Prisma.ProductWhereInput = {
        isActive: true,
        storeId: store.id,
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({ where: whereProducts, skip, take, orderBy: { createdAt: "desc" } }),
        prisma.product.count({ where: whereProducts }),
      ]);

      const productsPublic: ProductPublic[] = products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price.toNumber(),
        imageUrl: p.imageUrl,
        createdAt: p.createdAt.toISOString(),
      }));

      res.status(200).json({ success: true, data: productsPublic, total, page: Number(page) });
    } catch (error) {
      console.error("Erro ao listar produtos da loja:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar produtos da loja",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);
router.post(
  "/orders",
  requireJsonContent,
  anonSessionMiddleware,
  async (
    req: Request<{}, {}, CreateOrderRequest>,
    res: Response<
      ApiResult<
        Order & {
          orderAccessCode: string;
          paymentPix?: {
            qrCodeImage?: string;
            qrCodeText?: string;
            expiresAt?: string;
          };
        }
      >
    >,
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
      deliveryType = "DELIVERY", 
    } = req.body;

    // --- VALIDAÇÕES ---
    if (deliveryType === "DELIVERY") {
      if (
        !address ||
        typeof address !== "object" ||
        !address.street ||
        !address.city
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Endereço completo é obrigatório para o tipo de entrega 'DELIVERY'.",
          code: "INVALID_INPUT",
        });
      }
    }

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
    if (!customerEmail || !/^\S+@\S+\.\S+$/.test(customerEmail)) {
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
          storeId: true,
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

      const orderNumber = `PED-${uuidV4()
        .substring(0, 3)
        .toUpperCase()}-${moment().format("YYMMDDHHmmss")}`;

      const anonId = (req as any).anonId as string;
      const orderAccessCode = uuidV4().replace(/-/g, "").substring(0, 8).toUpperCase();

      // Prepara os dados do pedido
      const orderData: Prisma.OrderCreateInput = {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        customerTaxId,
        productName: product.name,
        quantity: Number(orderQuantity),
        unitPrice: product.price,
        totalPrice: new Decimal(totalPrice),
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        observations: observations || "",
        status: "pending",
        deliveryType,
        product: { connect: { id: product.id } },
        store: { connect: { id: product.storeId } },
        anonId,
        orderAccessCode,
      };

      // Adiciona o endereço apenas se for entrega
      if (deliveryType === "DELIVERY" && address) {
        orderData.street = address.street;
        orderData.number = address.number;
        orderData.neighborhood = address.neighborhood;
        orderData.city = address.city;
        orderData.state = address.state;
        orderData.zipCode = address.zipCode;
        orderData.complement = address.complement;
      }

      const newOrder = await prisma.order.create({ data: orderData });

      const pix = await createPixQrCodeRest(
        {
          amount: Math.round(totalPrice * 100),
          description: `Pedido ${orderNumber} - ${product.name}`,
          expiresIn: 3600,
          customer: {
            name: customerName,
            email: customerEmail,
            cellphone: `+55${customerPhone}`,
            taxId: customerTaxId,
          },
        },
        { debug: process.env.NODE_ENV !== 'production' },
      );
      if (pix.error) {
        // Map 401 from provider to 401 in our API for clearer setup issues
        const status = pix.status === 401 ? 401 : 502;
        console.error("AbacatePay retornou erro ao criar PIX:", pix.error || pix.raw);
        return res.status(status).json({
          success: false,
          error: status === 401 ? "Token de autenticação inválido ou ausente." : "Falha ao criar cobrança PIX",
          code: status === 401 ? "UNAUTHORIZED" : "PIX_ERROR",
        });
      }
      const pixData = pix.data;
      const updatedOrderWithPayment = await prisma.order.update({
        where: { id: newOrder.id },
        data: {
          paymentProviderId: pixData.id ?? pixData.txid ?? pixData.paymentId ?? undefined,
        },
      });

      const formattedOrder = formatOrderForApi(updatedOrderWithPayment);

      res.status(201).json({
        success: true,
        message: "Pedido criado com sucesso, aguardando pagamento via PIX.",
        data: {
          ...formattedOrder,
          orderAccessCode,
          paymentPix: {
            qrCodeImage: pixData?.brCodeBase64,
            qrCodeText: pixData?.brCode,
            expiresAt: pixData?.expiresAt,
          },
        },
      });
    } catch (error) {
      console.error("Error ao criar pedido:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao criar pedido",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);



//defvolver os dados publicos de um pedido
router.get(
  "/orders/:id",
  async (req: Request<{ id: string }>, res: Response<OrderPublicResponse>) => {
    const { id } = req.params; // O 'id' pode ser UUID ou orderNumber
    const { accessCode } = (req.query || {}) as { accessCode?: string };

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "ID ou número do pedido inválido",
        code: "INVALID_INPUT",
      });
    }

    // Tentar extrair anonId do cookie (não obrigatório)
    let anonIdFromCookie: string | undefined;
    try {
      const cookies = parseCookies(req.headers.cookie);
      const token = cookies["anon_session"];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        if (decoded?.typ === "anon") anonIdFromCookie = decoded.sub as string;
      }
    } catch (_e) {}

    try {
      let order: any;
      if (id.includes("-")) {
        order = await prisma.order.findUnique({ where: { id } });
      }
      if (!order) {
        order = await prisma.order.findUnique({ where: { orderNumber: id } });
      }
      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Pedido não encontrado",
          code: "ORDER_NOT_FOUND",
        });
      }

      const authorizedBySession = !!(anonIdFromCookie && order.anonId && order.anonId === anonIdFromCookie);
      const authorizedByCode = !!(accessCode && order.orderAccessCode && order.orderAccessCode === accessCode);
      if (!authorizedBySession && !authorizedByCode) {
        return res.status(403).json({
          success: false,
          error: "Acesso não autorizado a este pedido",
          code: "FORBIDDEN",
        });
      }

      const formattedPublicOrder = formatOrderPublicForApi(order);
      res.status(200).json({ success: true, data: formattedPublicOrder });
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
