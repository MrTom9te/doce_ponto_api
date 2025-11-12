import { type Request, type Response, Router } from "express";
import { Prisma, PrismaClient, DeliveryType } from "@/generated/prisma/client";
import {
  authMiddleware,
  requireJsonContent,
} from "@/middleware/auth.middleware";
import type { ApiResult } from "@/types/api.types";

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
};

// Função auxiliar para obter a loja do usuário
async function getStoreByUserId(userId: string) {
  if (!userId) return null;
  return prisma.store.findUnique({ where: { ownerId: userId } });
}

/**
 * @swagger
 * tags:
 *   name: Loja
 *   description: Endpoints para gerenciar as configurações da loja da confeiteira.
 */

/**
 * @swagger
 * /store:
 *   get:
 *     summary: Obtém as configurações da loja da confeiteira autenticada.
 *     tags: [Loja]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Detalhes e configurações da loja.
 *       '404':
 *         description: Loja não encontrada para o usuário.
 */
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

/**
 * @swagger
 * /store:
 *   patch:
 *     summary: Atualiza as configurações da loja da confeiteira autenticada.
 *     tags: [Loja]
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
 *               slug:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               themeColor:
 *                 type: string
 *               layoutStyle:
 *                 type: string
 *               fontFamily:
 *                 type: string
 *               street:
 *                 type: string
 *               number:
 *                 type: string
 *               neighborhood:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               complement:
 *                 type: string
 *               supportedDeliveryTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [DELIVERY, PICKUP]
 *     responses:
 *       '200':
 *         description: Loja atualizada com sucesso.
 *       '400':
 *         description: Erro de validação (ex: slug duplicado).
 *       '404':
 *         description: Loja não encontrada.
 */
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
