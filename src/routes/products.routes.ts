import { type Request, type Response, Router } from "express";
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import {
  authMiddleware,
  requireJsonContent,
} from "@/middleware/auth.middleware";
import type { ApiResult } from "@/types/api.types";
import type { PaginationResponse } from "@/types/pagination.types";
import type {
  CreateProductRequest,
  ListProductsParams,
  Product,
  ToggleProductRequest,
  UpdateProductRequest,
} from "@/types/products.types";
import {
  deleteImageFromFileSystem,
  uploadImageFromBase64,
} from "@/utils/upload.utils";
import { formatProductForApi } from "@/utils/format.utils";

const prisma = new PrismaClient();
const router = Router();

// Função auxiliar para obter a loja do usuário
async function getStoreByUserId(userId: string) {
  if (!userId) return null;
  return prisma.store.findUnique({ where: { ownerId: userId } });
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do produto.
 *           example: "660e8400-e29b-41d4-a716-446655440001"
 *         name:
 *           type: string
 *           description: O nome do produto.
 *           example: "Bolo de Chocolate"
 *         description:
 *           type: string
 *           description: A descrição do produto.
 *           example: "Delicioso bolo de chocolate com cobertura cremosa"
 *         price:
 *           type: number
 *           format: float
 *           description: O preço do produto.
 *           example: 45.50
 *         imageUrl:
 *           type: string
 *           description: A URL da imagem do produto.
 *           example: "http://localhost:3000/static/images/produto-1.jpg"
 *         isActive:
 *           type: boolean
 *           description: Indica se o produto está ativo para venda.
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: A data de criação do produto.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: A data da última atualização do produto.
 */

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Endpoints para gerenciamento de produtos (requer autenticação).
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos da confeiteira autenticada.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: O número da página para paginação.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: O número de itens por página.
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtra produtos por status de ativação.
 *     responses:
 *       '200':
 *         description: Uma lista de produtos.
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
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 */
router.get(
  "/",
  authMiddleware,
  async (
    req: Request<{}, {}, {}, ListProductsParams>,
    res: Response<PaginationResponse<Product>>,
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

      const { page = 1, limit = 20, active } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const whereClause: Prisma.ProductWhereInput = { storeId: store.id };
      if (active !== undefined) {
        whereClause.isActive = active === true;
      }

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
      res.status(500).json({
        success: false,
        error: "Erro ao buscar produtos",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtém os detalhes de um produto específico.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do produto.
 *     responses:
 *       '200':
 *         description: Detalhes do produto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Produto não encontrado.
 */
router.get(
  "/:id",
  authMiddleware,
  async (req: Request<{ id: string }>, res: Response<ApiResult<Product>>) => {
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
      const product = await prisma.product.findUnique({
        where: {
          id,
          storeId: store.id,
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Produto não encontrado",
          code: "PRODUCT_NOT_FOUND",
        });
      }

      const formatProduct = formatProductForApi(product);

      res.status(200).json({
        success: true,
        data: formatProduct,
      });
    } catch (_error) {
      res.status(500).json({
        success: false,
        error: "Erro ao buscar detalhes do produto",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               imageBase64:
 *                 type: string
 *                 format: byte
 *                 description: 'Imagem do produto em formato Base64.'
 *     responses:
 *       '201':
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post(
  "/",
  authMiddleware,
  requireJsonContent,
  async (
    req: Request<{}, {}, CreateProductRequest>,
    res: Response<ApiResult<Product>>,
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

      const { name, description, price, imageBase64 } = req.body;

      const uploadedUrl = await uploadImageFromBase64(imageBase64);
      if (uploadedUrl === null) {
        return res.status(400).json({
          success: false,
          error: "Falha ao processar a imagem Base64",
          code: "INVALID_INPUT",
        });
      }

      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          imageUrl: uploadedUrl,
          price,
          isActive: true,
          storeId: store.id,
        },
      });

      const formattedProduct = formatProductForApi(newProduct);

      res.status(201).json({
        success: true,
        message: "Produto criado com sucesso",
        data: formattedProduct,
      });
    } catch (error) {
      console.error("Erro ao criar produto", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao criar produto",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               imageBase64:
 *                 type: string
 *                 format: byte
 *               isActive:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Produto atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Produto não encontrado.
 */
router.put(
  "/:id",
  authMiddleware,
  requireJsonContent,
  async (
    req: Request<{ id: string }, {}, UpdateProductRequest>,
    res: Response<ApiResult<Product>>,
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
      const { description, imageBase64, name, price, isActive } = req.body;
      const dataToUpdate: Prisma.ProductUpdateInput = {};

      // Validações de entrada...
      if (name !== undefined) dataToUpdate.name = name;
      if (description !== undefined) dataToUpdate.description = description;
      if (price !== undefined) dataToUpdate.price = price;
      if (isActive !== undefined) dataToUpdate.isActive = isActive;

      const existingProduct = await prisma.product.findUnique({
        where: { id: id, storeId: store.id },
        select: { imageUrl: true },
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          error: "Produto não encontrado",
          code: "PRODUCT_NOT_FOUND",
        });
      }

      if (imageBase64 !== undefined) {
        const uploadedUrl = await uploadImageFromBase64(imageBase64);
        if (uploadedUrl === null) {
          return res.status(400).json({
            success: false,
            error: "Falha ao processar a nova imagem Base64.",
            code: "INVALID_INPUT",
          });
        }
        if (existingProduct.imageUrl) {
          await deleteImageFromFileSystem(existingProduct.imageUrl);
        }
        dataToUpdate.imageUrl = uploadedUrl;
      }

      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({
          success: false,
          error: "Nenhum dado fornecido para atualização",
          code: "INVALID_INPUT",
        });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: id, storeId: store.id },
        data: dataToUpdate,
      });

      const formattedProduct = formatProductForApi(updatedProduct);

      res.status(200).json({
        success: true,
        message: "Produto atualizado com sucesso",
        data: formattedProduct,
      });
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao atualizar produto",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deleta um produto permanentemente.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do produto.
 *     responses:
 *       '200':
 *         description: Produto deletado com sucesso.
 *       '404':
 *         description: Produto não encontrado.
 */
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request<{ id: string }>, res: Response<ApiResult<null>>) => {
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
      const productToDelete = await prisma.product.findUnique({
        where: { id, storeId: store.id },
        select: { imageUrl: true },
      });

      if (!productToDelete) {
        return res.status(404).json({
          success: false,
          error: "Produto não encontrado",
          code: "PRODUCT_NOT_FOUND",
        });
      }

      await prisma.product.delete({
        where: { id, storeId: store.id },
      });

      if (productToDelete.imageUrl) {
        await deleteImageFromFileSystem(productToDelete.imageUrl);
      }

      res.status(200).json({
        success: true,
        message: "Produto deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao deletar produto",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

/**
 * @swagger
 * /products/{id}/toggle:
 *   patch:
 *     summary: Ativa ou desativa um produto.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Status do produto atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Produto não encontrado.
 */
router.patch(
  "/:id/toggle",
  authMiddleware,
  requireJsonContent,
  async (
    req: Request<{ id: string }, {}, ToggleProductRequest>,
    res: Response<ApiResult<Product>>,
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
      const { isActive } = req.body;

      const updatedProduct = await prisma.product.update({
        where: { id, storeId: store.id },
        data: { isActive: isActive },
      });

      const formattedProduct = formatProductForApi(updatedProduct);

      res.status(200).json({
        success: true,
        message: "Status do produto atualizado",
        data: formattedProduct,
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({
          success: false,
          error: "Produto não encontrado",
          code: "PRODUCT_NOT_FOUND",
        });
      }
      console.log("Error ao alternar status do produto:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao atualizar status do produto",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);
export default router;
