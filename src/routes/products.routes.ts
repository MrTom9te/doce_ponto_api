import { type Request, type Response, Router } from "express";
import { PrismaClient } from "@/generated/prisma/client";
import { authMiddleware, requireJsonContent } from "@/middleware/auth.middleware";
import { ApiResult } from "@/types/api.types";
import type { PaginationResponse } from "@/types/pagination.types";
import type { CreateProductRequest, ListProductsParams, Product } from "@/types/products.types";
import { v4 as uuidv4 } from 'uuid';
import path from "path";

import fs from "fs/promises";


const prisma = new PrismaClient();
const router = Router();



const formatProductForApi = (product: any): Product => ({
	...product,
	price: product.price.toNumber(),
	createdAt: product.createdAt.toISOString(),
	updatedAt: product.updatedAt.toISOString(),
});

// ===============================================
//            ROTAS AUTENTICADAS
// ===============================================

// 2.1 - Listar Todos os Produtos (da confeiteira)
router.get(
	"/",
	authMiddleware,
	async (
		req: Request<{}, {}, {}, ListProductsParams>,
		res: Response<PaginationResponse<Product>>,
	) => {
		const userId = req.userId;
		const { page = 1, limit = 20, active } = req.query;

		const skip = (Number(page) - 1) * Number(limit);
		const take = Number(limit);
		const whereClause: any = { userId };
		if (active !== undefined) {
			whereClause.isActive = active === true;
		}
		try {
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
			res
				.status(500)
				.json({
					success: false,
					error: "Erro ao buscar produtos",
					code: "INTERNAL_SERVER_ERROR",
				});
		}
	},
);


router.get("/:id", authMiddleware, async (req: Request<{id:string}>,res:Response<ApiResult<Product>> ) => {

  const { id } = req.params;
  const userId = req.userId;


  try{
    const product= await prisma.product.findUnique({
      where: {
        id,
        userId
      }
    });

    if(!product) {
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
  }catch(_error){
    res.status(500).json({
      success: false,
      error: "Erro ao buscar detalhes do produto",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
} )


router.post("/", authMiddleware, requireJsonContent, async (req: Request<{}, {}, CreateProductRequest>, res: Response<ApiResult<Product>>) => {

  const userId = req.userId;
  const {name,description,price,imageBase64 } = req.body;

  let imageUrl: string | null;

  try {
    const uploadedUrl = await uploadImageFromBase64(imageBase64);

    if (uploadedUrl === null) {
      return res.status(400).json({ success: false, error: "Falha ao processar a imagem Base64", code: "INVALID_INPUT" });
    }

    imageUrl = uploadedUrl;
    const newProduct = await prisma.product.create({
      data: {
        name, description, imageUrl, price, isActive: true, userId
      },
    });

    const formattedProduct = formatProductForApi(newProduct);

    res.status(200).json({
      success: true,
      message: "Produto criado com sucesso",
      data: formattedProduct
    });
  } catch (error) {
    console.error("Erro ao criar produto", error)

    res.status(500).json({
      success: false,
      error: "Erro interno do servidor ao criar produto",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});


const uploadImageFromBase64 = async (imageBase64: string): Promise<string | null> => {
  const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    console.log("Formato de imagem base64 invalido")
    return null
  }

  const mimeType = matches[1];
  const imageData = matches[2];

  let fileExtension: string;
  switch (mimeType) {
    case 'image/jpeg':
      fileExtension = 'jpg';
      break;
    case 'image/png':
      fileExtension = 'png';
      break;
    case 'image/gif':
      fileExtension = 'gif';
      break;
    case 'image/webp': // Adicionando suporte para webp
      fileExtension = 'webp';
      break;
    // Adicione outros tipos MIME que você suporta
    default:
      console.error(`Tipo de imagem não suportado: ${mimeType}`);
      return null; // Tipo não suportado
  }

  try {
    const buffer = Buffer.from(imageData, "base64");
    const fileName = `${uuidv4()}.${fileExtension}`;

    const uploadDir = path.join(__dirname, '..', '..', 'public', 'images');

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    console.log(filePath,fileName)
    await fs.writeFile(filePath, buffer);
    return `/images/${fileName}`
  } catch (error) {
    console.error("Erro ao salvar imagem Base64:", error);
    return null;
  }

};

export default router
