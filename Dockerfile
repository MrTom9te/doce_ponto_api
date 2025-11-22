# Multi-stage build para API (Bun) + Vitrine (Vite/React)

# Etapa 1: instalar dependências e buildar vitrine
FROM oven/bun:1 AS builder

WORKDIR /app

# --- API: instalar deps ---
COPY doce_ponto_api/package.json doce_ponto_api/bun.lock ./doce_ponto_api/
WORKDIR /app/doce_ponto_api
ENV DATABASE_URL=postgresql://doce_ponto:senha123@db:5432/doce_ponto
RUN bun install --frozen-lockfile
RUN apt-get update -y && apt-get install -y openssl
# Copiar arquivos do Prisma e gerar client
COPY doce_ponto_api/prisma ./prisma
COPY doce_ponto_api/prisma.config.ts ./prisma.config.ts
RUN bunx --bun prisma generate

# Copiar código-fonte da API (inclui src/generated/prisma gerado acima)
COPY doce_ponto_api/src ./src
COPY doce_ponto_api/tsconfig.json ./tsconfig.json
COPY doce_ponto_api/swagger.config.ts ./swagger.config.ts

# --- Vitrine: instalar deps e buildar ---
WORKDIR /app
COPY vitrine/package.json vitrine/bun.lock ./vitrine/
WORKDIR /app/vitrine
RUN bun install --frozen-lockfile
COPY vitrine/ .
RUN bun run build

# Etapa 2: imagem final de runtime
FROM oven/bun:1

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app/doce_ponto_api

# Copiar node_modules e artefatos gerados da API
COPY --from=builder /app/doce_ponto_api/node_modules ./node_modules
COPY --from=builder /app/doce_ponto_api/prisma ./prisma
COPY --from=builder /app/doce_ponto_api/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/doce_ponto_api/src ./src
COPY --from=builder /app/doce_ponto_api/tsconfig.json ./tsconfig.json
COPY --from=builder /app/doce_ponto_api/swagger.config.ts ./swagger.config.ts

# Copiar build da vitrine para o caminho esperado pelo server.ts (../vitrine/dist)
WORKDIR /app
COPY --from=builder /app/vitrine/dist ./vitrine/dist

WORKDIR /app/doce_ponto_api

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "src/server.ts"]
