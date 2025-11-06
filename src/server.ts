import path from "node:path";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRouter from "@/routes/auth.routes";
import ordersRouter from "@/routes/order.routes";
import paymentsRouter from "@/routes/payments.routes";
import productsRouter from "@/routes/products.routes";
import publicRoutes from "@/routes/public.routes";
import swaggerOptions from "../swagger.config";

const app = express();

const swaggerDocs = swaggerJsdoc(swaggerOptions);
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
