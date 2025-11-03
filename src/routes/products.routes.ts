import { type Request, type Response, Router } from "express";
import {  Prisma, PrismaClient } from "@/generated/prisma/client";
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




/// 2.1 - Listar Todos os Produtos (da confeiteira)
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
		const { id } = req.params;
		const userId = req.userId;

		try {
			const product = await prisma.product.findUnique({
				where: {
					id,
					userId,
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
		const userId = req.userId;
		const { name, description, price, imageBase64 } = req.body;

		let imageUrl: string | null;

		try {
			const uploadedUrl = await uploadImageFromBase64(imageBase64);

			if (uploadedUrl === null) {
				return res.status(400).json({
					success: false,
					error: "Falha ao processar a imagem Base64",
					code: "INVALID_INPUT",
				});
			}

			imageUrl = uploadedUrl;
			const newProduct = await prisma.product.create({
				data: {
					name,
					description,
					imageUrl,
					price,
					isActive: true,
					userId,
				},
			});

			const formattedProduct = formatProductForApi(newProduct);

			res.status(200).json({
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
	authMiddleware, // A ordem aqui é importante: authMiddleware antes de requireJsonContent
	requireJsonContent,
	async (
		req: Request<{ id: string }, {}, UpdateProductRequest>,
		res: Response<ApiResult<Product>>,
	) => {
		const { id } = req.params;
		const userId = req.userId;
		const { description, imageBase64, name, price } = req.body;

		const dataToUpdate: Prisma.ProductUpdateInput = {};

		if (!id || typeof id !== "string") {
			return res
				.status(400)
				.json({
					success: false,
					error: "ID do produto inválido",
					code: "INVALID_INPUT",
				});
		}

		if (name !== undefined) {
			if (name.length < 2 || name.length > 100) {
				return res
					.status(400)
					.json({
						success: false,
						error: "Nome do produto deve ter entre 2 e 100 caracteres",
						code: "INVALID_INPUT",
					});
			}
			dataToUpdate.name = name;
		}

		if (description !== undefined) {
			if (description.length > 500) {
				return res
					.status(400)
					.json({
						success: false,
						error: "Descrição do produto deve ter no máximo 500 caracteres",
						code: "INVALID_INPUT",
					});
			}
			dataToUpdate.description = description;
		}
		if (price !== undefined) {
			if (price <= 0 || !/^\d+(\.\d{1,2})?$/.test(price.toString())) {
				return res
					.status(400)
					.json({
						success: false,
						error:
							"Preço do produto deve ser positivo e com no máximo 2 casas decimais",
						code: "INVALID_INPUT",
					});
			}
			dataToUpdate.price = price;
		}

		try {
			// Primeiro, encontre o produto existente para verificar a posse e pegar a URL da imagem antiga
			const existingProduct = await prisma.product.findUnique({
				where: { id: id, userId: userId },
				select: { imageUrl: true }, // Precisamos da imageUrl para possível deleção
			});

			if (!existingProduct) {
				return res
					.status(404)
					.json({
						success: false,
						error: "Produto não encontrado",
						code: "PRODUCT_NOT_FOUND",
					});
			}

			if (imageBase64 !== undefined) {
				const uploadedUrl = await uploadImageFromBase64(imageBase64);

				if (uploadedUrl === null) {
					return res
						.status(400)
						.json({
							success: false,
							error:
								"Falha ao processar a nova imagem Base64. Verifique o formato.",
							code: "INVALID_INPUT",
						});
				}

				if (existingProduct.imageUrl) {
					await deleteImageFromFileSystem(existingProduct.imageUrl);
				}

				dataToUpdate.imageUrl = uploadedUrl;
			}
			if (Object.keys(dataToUpdate).length === 0) {
				return res
					.status(400)
					.json({
						success: false,
						error: "Nenhum dado fornecido para atualização",
						code: "INVALID_INPUT",
					});
			}

			const updatedProduct = await prisma.product.update({
				where: {
					id: id,
					userId: userId,
				},
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

router.delete("/:id", authMiddleware, async (req: Request<{ id: string }>, res: Response<ApiResult<null>>) => {
const { id } = req.params;
const userId = req.userId;

if (!id || typeof id !== "string") {
  return res.status(400).json({ success: false, error: "ID do produto inválido", code: "INVALID_INPUT" });
}

try {
  const productToDelete = await prisma.product.findUnique({
    where: { id, userId },
    select: { imageUrl: true }
  });

  if (!productToDelete) {
    return res.status(404).json({ success: false, error: "Produto não encontrado", code: "PRODUCT_NOT_FOUND" });
  }

  await prisma.product.delete({
    where: { id, userId },
  });

    if (productToDelete.imageUrl) {
    try {
      await deleteImageFromFileSystem(productToDelete.imageUrl);
    } catch (imageDeleteError) {
           console.warn(`Aviso: Falha ao deletar imagem do produto ${id} ('${productToDelete.imageUrl}') no sistema de arquivos. Imagem pode estar órfã. Erro:`, imageDeleteError);
         }
  }

  // 4. Send a success response
  res.status(200).json({
    success: true,
    message: "Produto deletado com sucesso",
    data: null,
  });
} catch (error) {
  // This catch block will only handle errors from prisma.product.findUnique or prisma.product.delete
  // Errors from image deletion are handled in an inner try-catch for a more graceful failure.
  console.error("Erro ao deletar produto no banco de dados:", error);
  res.status(500).json({
    success: false,
    error: "Erro interno do servidor ao deletar produto",
    code: "INTERNAL_SERVER_ERROR",
  });
}
});



router.put("/:id/toggle", authMiddleware, requireJsonContent, async (req: Request<{ id: string }, {},ToggleProductRequest >, res: Response<ApiResult<Product>>) => {
  const { id } = req.params;
  const userId = req.userId
  const {isActive} = req.body;

  try{
    const updatededProduct = await prisma.product.update({
      where: { id, userId },
      data: { isActive: isActive }
    });

    const formattedProduct = formatProductForApi(updatededProduct);

    res.status(200).json({
      success:true,
      message:"Status do produto",
      data:formattedProduct
    })
  }catch(error:unknown){
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
           // P2025 é o código de erro do Prisma para registro não encontrado
           return res.status(404).json({
             success: false,
             error: "Produto não encontrado",
             code: "PRODUCT_NOT_FOUND",
           });
         }
    console.log("Error ao alternar status do produto:" ,error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor  ao atualizar status do produto",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
});
export default router;
