import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "anon_session";

type AnonJwtPayload = {
  sub: string;
  typ: "anon";
  ver: number;
  iat: number;
  exp: number;
};

export function parseCookies(header?: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  const parts = header.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join("="));
  }
  return out;
}

export const anonSessionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ success: false, error: "Sessão anônima ausente", code: "UNAUTHORIZED" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AnonJwtPayload;
    if (decoded.typ !== "anon") {
      return res.status(401).json({ success: false, error: "Token inválido", code: "UNAUTHORIZED" });
    }
    (req as any).anonId = decoded.sub;
    (req as any).anonVer = decoded.ver;
    return next();
  } catch (_e) {
    return res.status(401).json({ success: false, error: "Sessão inválida ou expirada", code: "UNAUTHORIZED" });
  }
};

export function issueAnonCookie(res: Response, anonId: string, ver = 1, maxAgeSec = 60 * 60 * 24 * 7) {
  const token = jwt.sign({ sub: anonId, typ: "anon", ver }, process.env.JWT_SECRET!, { expiresIn: maxAgeSec });
  const isProd = process.env.NODE_ENV === "production";
  const cookieParts = [
    `${COOKIE_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${maxAgeSec}`,
  ];
  if (isProd) cookieParts.push("Secure");
  res.setHeader("Set-Cookie", cookieParts.join("; "));
  return token;
}
