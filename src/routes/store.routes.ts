import { type Request, type Response, Router } from "express";
import { Prisma, PrismaClient, DeliveryType } from "@/generated/prisma/client";
import {
  authMiddleware,
  requireJsonContent,
} from "@/middleware/auth.middleware";
import type { ApiResult } from "@/types/api.types";
import { uploadImageFromBase64 } from "@/utils/upload.utils";

const prisma = new PrismaClient();
const router = Router();

type StoreSettings = {
  name?: string;
  slug?: string;
  logoUrl?: string;
  themeColor?: string;
  layoutStyle?: string;
  fontFamily?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  complement?: string;
  supportedDeliveryTypes?: DeliveryType[];
  imageBase64?: string;
};

// Função auxiliar para obter a loja do usuário
async function getStoreByUserId(userId: string) {
  if (!userId) return null;
  return prisma.store.findUnique({ where: { ownerId: userId } });
}
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response<ApiResult<any>>) => {
    try {
      const store = await getStoreByUserId(req.userId!);
      if (!store) {
        return res.status(404).json({
          success: false,
          error: "Loja não encontrada para este usuário.",
          code: "STORE_NOT_FOUND",
        });
      }
      res.status(200).json({ success: true, data: store });
    } catch (error) {
      console.error("Erro ao buscar configurações da loja:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor.",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);
router.patch(
  "/",
  authMiddleware,
  requireJsonContent,
  async (
    req: Request<{}, {}, StoreSettings>,
    res: Response<ApiResult<any>>,
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

      const {
        name,
        slug,
        logoUrl,
        themeColor,
        layoutStyle,
        fontFamily,
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
        complement,
        supportedDeliveryTypes,
        imageBase64,
      } = req.body;
      const dataToUpdate: Prisma.StoreUpdateInput = {};

      if (name) dataToUpdate.name = name;
      if (logoUrl) dataToUpdate.logoUrl = logoUrl;
      if (themeColor) dataToUpdate.themeColor = themeColor;
      if (layoutStyle) dataToUpdate.layoutStyle = layoutStyle;
      if (fontFamily) dataToUpdate.fontFamily = fontFamily;
      if (street) dataToUpdate.street = street;
      if (number) dataToUpdate.number = number;
      if (neighborhood) dataToUpdate.neighborhood = neighborhood;
      if (city) dataToUpdate.city = city;
      if (state) dataToUpdate.state = state;
      if (zipCode) dataToUpdate.zipCode = zipCode;
      if (complement) dataToUpdate.complement = complement;

      // Validar slug para garantir que é único, se for alterado
      if (slug) {
        if (slug !== store.slug) {
          const existingStore = await prisma.store.findUnique({
            where: { slug },
          });
          if (existingStore) {
            return res.status(400).json({
              success: false,
              error: "Esta URL da loja já está em uso.",
              code: "DUPLICATE_SLUG",
            });
          }
        }
        dataToUpdate.slug = slug;
      }

      // Lida com a atualização da lista de tipos de entrega
      if (
        supportedDeliveryTypes &&
        Array.isArray(supportedDeliveryTypes) &&
        supportedDeliveryTypes.every((type) =>
          Object.values(DeliveryType).includes(type),
        )
      ) {
        dataToUpdate.supportedDeliveryTypes = {
          set: supportedDeliveryTypes,
        };
      }

      // Upload opcional de logo via Base64, se fornecido
      if (imageBase64 !== undefined) {
        const uploadedUrl = await uploadImageFromBase64(imageBase64);
        if (uploadedUrl === null) {
          return res.status(400).json({
            success: false,
            error: "Falha ao processar a imagem Base64 do logo",
            code: "INVALID_INPUT",
          });
        }
        dataToUpdate.logoUrl = uploadedUrl;
      }

      const updatedStore = await prisma.store.update({
        where: { id: store.id },
        data: dataToUpdate,
      });

      res.status(200).json({
        success: true,
        message: "Loja atualizada com sucesso.",
        data: updatedStore,
      });
    } catch (error) {
      console.error("Erro ao atualizar configurações da loja:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor.",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

export default router;
