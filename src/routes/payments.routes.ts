import { PrismaClient } from "@/generated/prisma/client";
import { Request, Response, Router } from "express";

const prisma = new PrismaClient();
const router = Router();

const WEBHOOK_SECRET_FROM_ENV = process.env.ABACATE_URL_QUERY_KEY;

if (!WEBHOOK_SECRET_FROM_ENV) {
  console.warn(
    "ATENÇÃO: A variável ABACATE_URL_QUERY_KEY não está definida no .env. A verificação do webhook não funcionará.",
  );
}

router.post("/webhook", async (req: Request, res: Response) => {
  if (WEBHOOK_SECRET_FROM_ENV) {
    const secretFromQuery = req.query.webhookSecret;

    if (secretFromQuery !== WEBHOOK_SECRET_FROM_ENV) {
      console.warn(
        "Webhook recebido com chave secreta inválida ou ausente na URL.",
      );
      return res.status(403).send("Acesso negado.");
    }
  }
  const event = req.body;
  console.log("Webhook recebido e validado:", JSON.stringify(event, null, 2));

  try {
    if (event.event === "billing.paid") {
      const billingData = event.data.billing;
      const paymentProviderId = billingData.id;
      const order = await prisma.order.findUnique({
        where: { paymentProviderId: paymentProviderId },
      });

      if (order) {
        if (order.status === "pending") {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "confirmed",
            },
          });
          console.log(`Pedido ${order.orderNumber} confirmado via webhook.`);
        } else {
          console.log(
            `Webhook para pedido ${order.orderNumber} recebido, mas status já era '${order.status}'. Nenhuma ação tomada.`,
          );
        }
      } else {
        console.warn(
          `Webhook recebido para um pagamento não encontrado no banco: ${paymentProviderId}`,
        );
      }
    }
    res.status(200).send("Webhook recebido com sucesso.");
  } catch (error) {
    console.error("Erro ao processar webhook do Abacate Pay:", error);
    res.status(500).send("Erro interno ao processar webhook.");
  }
});

export default router;
