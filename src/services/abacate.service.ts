import AbacatePay from "abacatepay-nodejs-sdk";
import dotenv from "dotenv";

dotenv.config();

const abacatePayApiKey = process.env.ABACATE_PAY_ACCESS_KEY;
if (!abacatePayApiKey) {
  throw new Error(
    "A variável de ambiente ABACATE_PAY_ACCESS_KEY não está definida.",
  );
}

export async function createPixQrCodeRest(
  params: CreatePixParams,
  opts?: CreatePixOptions,
): Promise<{ data?: any; error?: any; raw?: any; status?: number }> {
  const endpoint = "https://api.abacatepay.com/v1/pixQrCode/create";
  const apiKey = process.env.ABACATE_PAY_ACCESS_KEY;
  try {
    const payload: any = {
      amount: params.amount,
      expiresIn: params.expiresIn,
      description: params.description,
    };
    if (params.customer) payload.customer = params.customer;
    if (params.metadata) payload.metadata = params.metadata;

    if (opts?.debug) {
      try {
        const safe = { ...payload, customer: payload.customer ? { ...payload.customer, email: "***", taxId: "***", cellphone: "***" } : undefined };
        console.debug("[REST] AbacatePay PIX create request:", JSON.stringify(safe));
      } catch {}
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body: any = await res.json().catch(() => ({} as any));
    if (opts?.debug) {
      try {
        console.debug("[REST] AbacatePay PIX create response:", JSON.stringify({ status: res.status, body }));
      } catch {}
    }
    if (!res.ok) {
      return { error: body?.error || `HTTP_${res.status}`, raw: body, status: res.status };
    }
    const data = body?.data ?? body;
    if (!data || (typeof data === "object" && !("id" in data) && !("brCode" in data) && !("brCodeBase64" in data))) {
      return { error: new Error("Resposta inválida do AbacatePay (REST)"), raw: body, status: res.status };
    }
    return { data, raw: body, status: res.status };
  } catch (err) {
    if (opts?.debug) {
      console.error("[REST] AbacatePay PIX create threw:", err);
    }
    return { error: err };
  }
}

export const abacate = AbacatePay(abacatePayApiKey);

type CreatePixParams = {
  amount: number;
  description: string;
  expiresIn: number;
  customer?: {
    name?: string;
    email?: string;
    cellphone?: string;
    taxId?: string;
  };
  metadata?: Record<string, any>;
};

type CreatePixOptions = { debug?: boolean };

export async function createPixQrCode(
  params: CreatePixParams,
  opts?: CreatePixOptions,
): Promise<{ data?: any; error?: any; raw?: any }> {
  try {
    // Map to SDK expected shape; cast to any to avoid SDK typing mismatches.
    const sdkParams: any = {
      amount: params.amount,
      description: params.description,
      expiresIn: params.expiresIn,
    };
    if (params.customer) {
      sdkParams.customer = { ...params.customer };
    }
    if (params.metadata) {
      sdkParams.metadata = params.metadata;
    }
    const result = await abacate.pixQrCode.create(sdkParams as any);
    const data = (result as any)?.data ?? result;
    if (opts?.debug) {
      try {
        console.debug("AbacatePay PIX create result:", JSON.stringify(result));
      } catch {}
    }
    if (!data || (typeof data === "object" && !("id" in data) && !("brCode" in data) && !("brCodeBase64" in data))) {
      return { error: new Error("Resposta inválida do AbacatePay"), raw: result };
    }
    return { data, raw: result };
  } catch (err) {
    if (opts?.debug) {
      console.error("AbacatePay PIX create threw:", err);
    }
    return { error: err };
  }
}
