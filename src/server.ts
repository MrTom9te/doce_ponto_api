import express from "express";

import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (_req, res) => {
	res.json({ message: "Bem Vindo a Api Doce Ponto" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT} `);
});
