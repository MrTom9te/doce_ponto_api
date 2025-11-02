import { PrismaClient } from "@/generated/prisma/client";
import { ListParams, PaginationResponse } from "@/types/pagination.types";
import { ProductPublic } from "@/types/products.types";
import { Request, Response, Router } from "express";


const router = Router();


const prisma = new PrismaClient;

router.get("/products", async (req: Request<{},{},{},ListParams>, res: Response<PaginationResponse<ProductPublic>>) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const whereClause:any = {}
  whereClause.isActive = true

  try {
    const products = await prisma.product.findMany({
      where: whereClause,
      skip,
      take, orderBy: { createdAt: "desc" }
    })

    const total = await prisma.product.count({ where: whereClause });

    const productsPublic: ProductPublic[] = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price.toNumber(), // Certifique-se de converter o Decimal do Prisma
      imageUrl: p.imageUrl,
      createdAt: p.createdAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: productsPublic, total, page: Number(page)
    })
  } catch (_error) {
    res.status(200).json({
      success: false,
      error: "Erro ao buscar produtos públicos",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
});


export default router
