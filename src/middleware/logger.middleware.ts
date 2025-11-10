import morgan from "morgan";
import type { Request, Response, NextFunction } from "express";
import type { ApiResult } from "@/types/api.types";

// ==================== MIDDLEWARE DE CAPTURA ====================

/**
 * Middleware que captura o ApiResult da resposta para logging
 */
export function captureApiResult(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const originalJson = res.json.bind(res);

  res.json = (data: any) => {
    // Armazena o ApiResult para os tokens do Morgan acessarem
    (res as any).__apiResult = data;
    return originalJson(data);
  };

  next();
}

// ==================== TOKENS CUSTOMIZADOS DO MORGAN ====================

/**
 * Token que retorna ✓ para sucesso ou ✗ para erro
 */
morgan.token("api-status", (req: Request, res: Response) => {
  const result = (res as any).__apiResult as ApiResult<any> | undefined;

  if (!result) return "-";

  // Usa o discriminator 'success' para determinar o tipo
  return result.success ? "✓" : "✗";
});

/**
 * Token que retorna o campo 'error' se for ErrorResponse
 */
morgan.token("api-error", (req: Request, res: Response) => {
  const result = (res as any).__apiResult as ApiResult<any> | undefined;

  if (!result) return "-";

  // Type narrowing: se success === false, TypeScript sabe que é ErrorResponse
  if (!result.success) {
    return result.error || "-";
  }

  return "-";
});

/**
 * Token que retorna o campo 'message' (presente em ambos os tipos)
 */
morgan.token("api-message", (req: Request, res: Response) => {
  const result = (res as any).__apiResult as ApiResult<any> | undefined;

  if (!result) return "-";

  return result.message || "-";
});

/**
 * Token que retorna o 'code' se for ErrorResponse
 */
morgan.token("api-error-code", (req: Request, res: Response) => {
  const result = (res as any).__apiResult as ApiResult<any> | undefined;

  if (!result) return "-";

  // Type narrowing com discriminated union
  if (!result.success) {
    return result.code || "-";
  }

  return "-";
});

/**
 * Token que retorna informação sobre o data se for SucessResponse
 */
morgan.token("api-data-info", (req: Request, res: Response) => {
  const result = (res as any).__apiResult as ApiResult<any> | undefined;

  if (!result) return "-";

  // Type narrowing: se success === true, TypeScript sabe que é SucessResponse
  if (result.success) {
    if (!result.data) return "no-data";

    if (Array.isArray(result.data)) {
      return `array[${result.data.length}]`;
    }

    return typeof result.data;
  }

  return "-";
});

// ==================== FORMATOS DE LOG ====================

/**
 * Formato compacto para produção
 */
export const morganApiLogger = morgan(
  ':api-status :method :url :status :response-time ms | msg: ":api-message" | err: ":api-error"',
  {
    skip: (req, res) => req.url === "/health",
  },
);

/**
 * Formato detalhado para desenvolvimento
 */
export const morganApiLoggerDev = morgan(
  (tokens, req, res) => {
    const status = tokens["api-status"](req, res);
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const httpStatus = tokens.status(req, res);
    const responseTime = tokens["response-time"](req, res);
    const message = tokens["api-message"](req, res);
    const error = tokens["api-error"](req, res);
    const errorCode = tokens["api-error-code"](req, res);
    const dataInfo = tokens["api-data-info"](req, res);

    // Monta o log formatado
    let log = `${status} ${method} ${url} ${httpStatus} ${responseTime}ms\n`;

    if (message !== "-") {
      log += `  Message: ${message}\n`;
    }

    if (error !== "-") {
      log += `  Error: ${error}\n`;
      log += `  Code: ${errorCode}\n`;
    } else if (dataInfo !== "-") {
      log += `  Data: ${dataInfo}\n`;
    }

    return log;
  },
  {
    skip: (req, res) => req.url === "/health",
  },
);

/**
 * Formato JSON para logs estruturados (útil para ferramentas de monitoring)
 */
export const morganApiLoggerJson = morgan(
  (tokens, req, res) => {
    const result = (res as any).__apiResult as ApiResult<any> | undefined;

    const logEntry = {
      timestamp: new Date().toISOString(),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      httpStatus: tokens.status(req, res),
      responseTime: `${tokens["response-time"](req, res)}ms`,
      success: result?.success ?? null,
      message: tokens["api-message"](req, res),
      ...(result &&
        !result.success && {
          error: result.error,
          errorCode: result.code,
        }),
      ...(result &&
        result.success && {
          hasData: !!result.data,
        }),
    };

    return JSON.stringify(logEntry);
  },
  {
    skip: (req, res) => req.url === "/health",
  },
);

// ==================== SETUP COMPLETO ====================

/**
 * Configura os middlewares de logging no app Express
 *
 * @example
 * import express from 'express';
 * import { setupApiLogging } from './middlewares/logging';
 *
 * const app = express();
 *
 * // Configuração básica
 * setupApiLogging(app);
 *
 * // Ou com opções
 * setupApiLogging(app, {
 *   format: 'dev', // 'compact' | 'dev' | 'json'
 *   skipHealthCheck: true
 * });
 */
export function setupApiLogging(
  app: any,
  options: {
    format?: "compact" | "dev" | "json";
    skipHealthCheck?: boolean;
  } = {},
) {
  const { format = "compact" } = options;

  // 1. Middleware de captura (DEVE vir antes das rotas)
  app.use(captureApiResult);

  // 2. Logger apropriado baseado no formato
  switch (format) {
    case "dev":
      app.use(morganApiLoggerDev);
      break;
    case "json":
      app.use(morganApiLoggerJson);
      break;
    default:
      app.use(morganApiLogger);
  }
}

// ==================== EXEMPLO DE USO ====================

/*
// No seu app.ts ou server.ts:

import express from 'express';
import { setupApiLogging } from './middlewares/logging';

const app = express();

// Setup do logging (antes das rotas!)
setupApiLogging(app, {
  format: process.env.NODE_ENV === 'production' ? 'json' : 'dev'
});

// Suas rotas
app.get('/users', async (req, res) => {
  const users = await getUsers();
  const response: SucessResponse<User[]> = {
    success: true,
    data: users,
    message: 'Usuários listados com sucesso'
  };
  res.json(response);
});

app.get('/error', async (req, res) => {
  const response: ErrorResponse = {
    success: false,
    error: 'Usuário não encontrado',
    code: 'USER_NOT_FOUND',
    message: 'O usuário solicitado não existe'
  };
  res.status(404).json(response);
});

app.listen(3000);
*/
