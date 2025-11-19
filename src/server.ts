import path from "node:path";
import os from "node:os";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swagger.config";
import authRouter from "@/routes/auth.routes";
import ordersRouter from "@/routes/order.routes";
import paymentsRouter from "@/routes/payments.routes";
import productsRouter from "@/routes/products.routes";
import publicRoutes from "@/routes/public.routes";
import storeRouter from "@/routes/store.routes"; // Importa a nova rota
import anonRoutes from "@/routes/anon.routes";
import { setupApiLogging } from "./middleware/logger.middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({path: path.join(__dirname, "..", ".env")});


const app = express();
app.use(cors());
// Setup do logging (antes das rotas!)
setupApiLogging(app, {
  format: process.env.NODE_ENV === "production" ? "json" : "dev",
});
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json({limit: "50mb"}));

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/public", publicRoutes);
app.use("/api/payment", paymentsRouter);
app.use("/api/store", storeRouter); // Registra a nova rota
app.use("/api/anon", anonRoutes);

// Sirva os arquivos estáticos da pasta de imagens
app.use(
  "/static/images",
  express.static(path.join(__dirname, "..", "public", "images")),
);

// --- Configuração para servir a Vitrine (SPA) na raiz ---

// 1. Caminho para o build do projeto vitrine (../vitrine/dist)
const vitrineDistPath = path.join(__dirname, "..", "..", "vitrine", "dist");

// 2. Serve os arquivos estáticos da vitrine
app.use(express.static(vitrineDistPath));

// 3. Catch-all: qualquer GET que não comece com /api atende o index.html da vitrine
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(vitrineDistPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);

  try {
    const networkInterfaces = os.networkInterfaces();
    const ip = Object.values(networkInterfaces)
      .flat()
      .find((i) => i?.family === "IPv4" && !i.internal)?.address;

    if (ip) {
      console.log(`🔗 Disponível na rede em: http://${ip}:${PORT}`);
    }
  } catch {}
});
