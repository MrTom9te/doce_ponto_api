import { Router, type Request, type Response } from "express";
import { PrismaClient } from "@/generated/prisma/client";
import { v4 as uuidv4 } from "uuid";
import { issueAnonCookie } from "@/middleware/anon.middleware";

const prisma = new PrismaClient();
const router = Router();

router.post("/session", async (req: Request, res: Response) => {
  try {
    const anon = await prisma.anonymousSession.create({
      data: {
        userAgent: req.headers["user-agent"] || null,
      },
    });
    issueAnonCookie(res, anon.id, anon.tokenVersion);
    return res.status(201).json({ success: true, data: { anonId: anon.id } });
  } catch (e) {
    return res.status(500).json({ success: false, error: "Erro ao criar sessão anônima", code: "INTERNAL_SERVER_ERROR" });
  }
});

router.post("/session/refresh", async (req: Request, res: Response) => {
  try {
    const cookie = req.headers.cookie || "";
    const match = cookie.match(/anon_session=([^;]+)/);
    if (!match) return res.status(401).json({ success: false, error: "Sessão ausente", code: "UNAUTHORIZED" });
    // Não validamos ver no DB por simplicidade neste MVP; apenas atualizamos lastSeen.
    const token = match[1];
    // Decodificação leve apenas para pegar anonId
    const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64").toString() || "{}");
    const anonId = payload.sub as string | undefined;
    if (!anonId) return res.status(401).json({ success: false, error: "Sessão inválida", code: "UNAUTHORIZED" });

    await prisma.anonymousSession.update({ where: { id: anonId }, data: { lastSeen: new Date() } });
    const current = await prisma.anonymousSession.findUnique({ where: { id: anonId } });
    if (!current || current.revoked) return res.status(401).json({ success: false, error: "Sessão revogada", code: "UNAUTHORIZED" });

    issueAnonCookie(res, anonId, current.tokenVersion);
    return res.status(200).json({ success: true, data: { anonId } });
  } catch (e) {
    return res.status(500).json({ success: false, error: "Erro ao renovar sessão", code: "INTERNAL_SERVER_ERROR" });
  }
});

export default router;
