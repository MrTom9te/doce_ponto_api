import path from "node:path";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRouter from "@/routes/auth.routes";
import ordersRouter from "@/routes/order.routes";
import paymentsRouter from "@/routes/payments.routes";
import productsRouter from "@/routes/products.routes";
import publicRoutes from "@/routes/public.routes";

const app = express();

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

app.get("/", (_req, res) => {
  res.json({ message: "Bem Vindo a Api Doce Ponto" });
});

app.use(
  "/static/images",
  express.static(path.join(__dirname, "..", "public", "images")),
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} `);
});
