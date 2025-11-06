import dotenv from "dotenv";
import AbacatePay from "abacatepay-nodejs-sdk";
dotenv.config();

const abacatePayApiKey = process.env.ABACATE_PAY_ACCESS_KEY;
if (!abacatePayApiKey) {
  throw new Error(
    "A variável de ambiente ABACATE_PAY_ACCESS_KEY não está definida.",
  );
}

export const abacate = AbacatePay(abacatePayApiKey);
