import path from "node:path";
import express from "express";
import morgan from "morgan";
import authRouter from "@/routes/auth.routes";
import productsRouter from "@/routes/products.routes";
import publicRoutes from "@/routes/public.routes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/public", publicRoutes);
app.get("/", (_req, res) => {
	res.json({ message: "Bem Vindo a Api Doce Ponto" });
});
app.use((req, res, next) => {
  console.log(`Acessando: ${req.method} ${req.path}`);
  next(); // passa para o próximo middleware/rota
});

app.use(
	"/static/images",
	express.static(path.join(__dirname, "..", "public", "images")),
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT} `);
});
