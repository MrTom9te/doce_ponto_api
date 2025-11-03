import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { ErrorResponse } from "@/types/api.types";

interface JwtPayload {
	userId: string;
}

export const authMiddleware = (
	req: Request,
	res: Response<ErrorResponse>,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			success: false,
			error: "Acesso negado. Nenhum token fornecido",
			code: "UNAUTHORIZED",
		});
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

		req.userId = decoded.userId;
		next();
	} catch (_err) {
		return res.status(401).json({
			success: false,
			error: "Token invalido ou expirado.",
			code: "UNATHOURIZED",
		});
	}
};

export const requireJsonContent = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(415).json({
      success: false,
      error: "Content-Type deve ser application/json",
      code: "UNSUPPORTED_MEDIA_TYPE",
    });
  }
  next(); // Prossegue para o próximo middleware/rota se o Content-Type for JSON
};
