import AbacatePay from "abacatepay-nodejs-sdk";
import dotenv from "dotenv";

dotenv.config();

const abacatePayApiKey = process.env.ABACATE_PAY_ACCESS_KEY;
if (!abacatePayApiKey) {
  throw new Error(
    "A variável de ambiente ABACATE_PAY_ACCESS_KEY não está definida.",
  );
}

export const abacate = AbacatePay(abacatePayApiKey);
