import path from "node:path";
import os from "node:os";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRouter from "@/routes/auth.routes";
import ordersRouter from "@/routes/order.routes";
import paymentsRouter from "@/routes/payments.routes";
import productsRouter from "@/routes/products.routes";
import publicRoutes from "@/routes/public.routes";
import { setupApiLogging } from "./middleware/logger.middleware";

const app = express();
// Setup do logging (antes das rotas!)
setupApiLogging(app, {
  format: process.env.NODE_ENV === "production" ? "json" : "dev",
});

const swaggerDocs = swaggerJsdoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Doce Ponto API",
      version: "1.0.0",
      description:
        "Documentação da API para o sistema de confeitaria Doce Ponto, gerada automaticamente.",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // URL base da sua API
      },
    ],
  },

  apis: ["./src/routes/*.ts"],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/public", publicRoutes);
app.use("/api/payment", paymentsRouter);

// Sirva os arquivos estáticos da pasta de imagens
app.use(
  "/static/images",
  express.static(path.join(__dirname, "..", "public", "images")),
);

// --- Configuração para servir o SPA ---

// 1. Define o caminho para a pasta de build do SPA
const spaDistPath = path.join(__dirname, "dist");

// 2. Serve os arquivos estáticos (JS, CSS, imagens) do SPA
app.use(express.static(spaDistPath));

// 3. Rota catch-all: para qualquer outra requisição GET que não seja para a API,
//    envia o `index.html` do SPA. Isso permite que o React Router controle as rotas.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(spaDistPath, "dist", "index.html"));
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
