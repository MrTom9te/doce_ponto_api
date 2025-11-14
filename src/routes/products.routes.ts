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
