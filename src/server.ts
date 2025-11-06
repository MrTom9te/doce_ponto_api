import path from "node:path";
import express from "express";
import authRouter from "@/routes/auth.routes";
import ordersRouter from "@/routes/order.routes";
import productsRouter from "@/routes/products.routes";
import publicRoutes from "@/routes/public.routes";
import paymentsRouter from "@/routes/payments.routes";
const app = express();

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
