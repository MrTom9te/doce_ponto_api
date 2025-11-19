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
  isOpen?: boolean;
  openingHours?: any;
};

// Função auxiliar para obter a loja do usuário
async function getStoreByUserId(userId: string) {
  if (!userId) return null;
  return prisma.store.findUnique({ where: { ownerId: userId } });
}
// Criar loja do usuário autenticado (inativa por padrão)
router.post(
  "/",
  authMiddleware,
  requireJsonContent,
  async (
    req: Request<{}, {}, StoreSettings>,
    res: Response<ApiResult<any>>, 
  ) => {
    try {
      const existing = await getStoreByUserId(req.userId!);
      if (existing) {
        return res.status(400).json({
          success: false,
          error: "Usuário já possui uma loja cadastrada.",
          code: "STORE_ALREADY_EXISTS",
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
        isOpen,
        openingHours,
      } = req.body;

      // Campos mínimos para criar a loja
      if (!name || !slug) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios ausentes: name e slug",
          code: "INVALID_INPUT",
        });
      }

      // Validar padrão do slug
      const slugPattern = /^[a-z0-9-]+$/;
      if (!slugPattern.test(slug)) {
        return res.status(400).json({
          success: false,
          error: "Slug inválido. Use apenas letras minúsculas, números e hífens.",
          code: "INVALID_INPUT",
        });
      }

      // Unicidade do slug
      const slugTaken = await prisma.store.findUnique({ where: { slug } });
      if (slugTaken) {
        return res.status(400).json({
          success: false,
          error: "Esta URL da loja já está em uso.",
          code: "DUPLICATE_SLUG",
        });
      }

      // Upload opcional do logo via Base64
      let finalLogoUrl = logoUrl;
      if (imageBase64 !== undefined) {
        const uploadedUrl = await uploadImageFromBase64(imageBase64);
        if (uploadedUrl === null) {
          return res.status(400).json({
            success: false,
            error: "Falha ao processar a imagem Base64 do logo",
            code: "INVALID_INPUT",
          });
        }
        finalLogoUrl = uploadedUrl;
      }

      // Validação de tipos de entrega
      let deliveryTypesData: { set: DeliveryType[] } | undefined = undefined;
      if (
        supportedDeliveryTypes &&
        Array.isArray(supportedDeliveryTypes) &&
        supportedDeliveryTypes.every((t) => Object.values(DeliveryType).includes(t))
      ) {
        deliveryTypesData = { set: supportedDeliveryTypes };
      }

      const newStore = await prisma.store.create({
        data: {
          name,
          slug,
          logoUrl: finalLogoUrl,
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
          supportedDeliveryTypes: deliveryTypesData,
          isActive: false, // sempre inicia inativa
          isOpen: typeof isOpen === "boolean" ? isOpen : false,
          openingHours: openingHours ?? undefined,
          owner: { connect: { id: req.userId! } },
        },
      });

      return res.status(201).json({
        success: true,
        message: "Loja criada com sucesso",
        data: newStore,
      });
    } catch (error) {
      console.error("Erro ao criar loja:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao criar loja.",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

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
      const hasLogo = Boolean(store.logoUrl);
      const hasBasic = Boolean(
        store.name && store.slug && store.street && store.city && store.state && store.zipCode,
      );
      const hasTheme = Boolean(store.themeColor && store.layoutStyle && store.fontFamily);
      const hasDelivery = Array.isArray(store.supportedDeliveryTypes) && store.supportedDeliveryTypes.length >= 1;
      const hasOpening = store.openingHours !== undefined && store.openingHours !== null;
      const isComplete = hasLogo && hasBasic && hasTheme && hasDelivery && hasOpening;

      if (!store.isActive && isComplete) {
        const updated = await prisma.store.update({
          where: { id: store.id },
          data: { isActive: true },
        });
        return res.status(200).json({ success: true, data: updated });
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
        isOpen,
        openingHours,
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
      if (typeof isOpen === "boolean") dataToUpdate.isOpen = isOpen;
      if (openingHours !== undefined) dataToUpdate.openingHours = openingHours as any;

      // Validar slug para garantir que é único, se for alterado
      if (slug) {
        // validar padrão
        const slugPattern = /^[a-z0-9-]+$/;
        if (!slugPattern.test(slug)) {
          return res.status(400).json({
            success: false,
            error: "Slug inválido. Use apenas letras minúsculas, números e hífens.",
            code: "INVALID_INPUT",
          });
        }
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

      // Após preparar os dados, calcular a "completude" para ativação automática
      const finalData = { ...store, ...dataToUpdate } as any;
      const hasLogo = Boolean(finalData.logoUrl);
      const hasBasic = Boolean(
        finalData.name && finalData.slug && finalData.street && finalData.city && finalData.state && finalData.zipCode,
      );
      const hasTheme = Boolean(finalData.themeColor && finalData.layoutStyle && finalData.fontFamily);
      const hasDelivery = Array.isArray(finalData.supportedDeliveryTypes) && finalData.supportedDeliveryTypes.length >= 1;
      const hasOpening = finalData.openingHours !== undefined && finalData.openingHours !== null;
      const isComplete = hasLogo && hasBasic && hasTheme && hasDelivery && hasOpening;

      dataToUpdate.isActive = isComplete;

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
