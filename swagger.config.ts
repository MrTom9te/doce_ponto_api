const swaggerOptions = {
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
  // Caminho para os arquivos que contêm as anotações da API
  apis: ["./src/routes/*.ts"],
};

module.exports = swaggerOptions;
