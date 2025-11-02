
import authRouter from "@/routes/auth.routes";
import productsRouter from "@/routes/products.routes";
import publicRoutes from "@/routes/public.routes";
import express from "express";
const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/public", publicRoutes);
app.get("/", (_req, res) => {
	res.json({ message: "Bem Vindo a Api Doce Ponto" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT} `);
});
