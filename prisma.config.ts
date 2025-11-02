import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	engine: "classic",
	datasource: {
		url: "postgresql://doce_ponto:senha123@localhost:5432/doce_ponto",
	},
});
