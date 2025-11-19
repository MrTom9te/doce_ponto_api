import path from "node:path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Doce Ponto API",
      version: "1.0.0",
      description:
        "Documentação da API para o sistema de confeitaria Doce Ponto, gerada automaticamente.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: [
    path.join(process.cwd(), "src/routes/*.ts"),
    path.join(process.cwd(), "src/docs/**/*.yaml"),
  ],
} as const;

export default swaggerOptions;
