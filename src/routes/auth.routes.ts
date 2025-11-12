import bcrypt from "bcryptjs";
import { type Request, type Response, Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@/generated/prisma/client";
import type { ApiResult } from "@/types/api.types";
import type {
  AuthData,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth.types";

const prisma = new PrismaClient();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints de registro e login de usuários
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra uma nova confeiteira.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Maria Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria@confeitaria.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Senha123!"
 *               phone:
 *                 type: string
 *                 example: "5592999887766"
 *     responses:
 *       '201':
 *         description: Usuário registrado com sucesso.
 *       '400':
 *         description: 'Erro de validação (ex: email duplicado, senha fraca).'
 */
router.post(
  "/register",
  async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
    try {
      const { name, email, password, phone } = req.body;

      // --- 1. Validação de Entrada ---
      if (!name || !email || !password || !phone) {
        return res.status(400).json({
          success: false,
          error: "Todos os campos são obrigatórios.",
          code: "INVALID_INPUT",
        });
      }

      // Validações mais específicas conforme ESPECIFY.md
      if (
        password.length < 8 ||
        !/\d/.test(password) ||
        !/[a-zA-Z]/.test(password)
      ) {
        return res.status(400).json({
          success: false,
          error:
            "A senha deve ter no mínimo 8 caracteres, incluindo pelo menos um número e uma letra.",
          code: "INVALID_INPUT",
        });
      }

      if (phone.length < 10 || phone.length > 11) {
        return res.status(400).json({
          success: false,
          error: "O telefone deve ter 10 ou 11 dígitos.",
          code: "INVALID_INPUT",
        });
      }

      // --- 2. Verificar se o E-mail já existe ---
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email já registrado",
          code: "DUPLICATE_EMAIL",
        });
      }

      // --- 3. Hashear a Senha ---
      // O 'salt' é um fator de complexidade para o hash. 10 é um bom valor padrão.
      const hashedPassword = await bcrypt.hash(password, 10);

      // --- 4. Criar o Usuário e a Loja atomicamente ---
      // Gerar um slug único para a loja a partir do nome do usuário
      const baseSlug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const uniqueSlug = `${baseSlug}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          // Nested write: cria a loja junto com o usuário
          store: {
            create: {
              name: name, // O nome da loja é o nome do usuário por padrão
              slug: uniqueSlug,
            },
          },
        },
      });

      // --- 5. Preparar e Enviar a Resposta ---
      // Remova a senha do objeto de usuário antes de enviá-lo na resposta.
      const userResponse = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
      };

      return res.status(201).json({
        success: true,
        message: "Usuário registrado com sucesso",
        data: userResponse,
      });
    } catch (error) {
      console.error("Erro no registro de usuário:", error);
      return res.status(500).json({
        success: false,
        error: "Ocorreu um erro interno no servidor.",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica a confeiteira e retorna um token JWT.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria@confeitaria.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Senha123!"
 *     responses:
 *       '200':
 *         description: Login realizado com sucesso. Retorna o token e os dados do usuário.
 *       '401':
 *         description: Email ou senha incorretos.
 */
router.post(
  "/login",
  async (
    req: Request<{}, {}, LoginRequest>,
    res: Response<ApiResult<AuthData>>,
  ) => {
    try {
      const { email, password } = req.body;

      // 1. Validação de entrada básica
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email e senha são obrigatórios.",
          code: "INVALID_INPUT",
        });
      }

      // 2. Buscar o usuário pelo e-mail
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // 3. Verificar se o usuário existe E se a senha corresponde
      // Usamos bcrypt.compare para comparar a senha enviada com a hash salva.
      // É crucial retornar o mesmo erro para "usuário não encontrado" e "senha errada"
      // para evitar que um atacante descubra quais e-mails estão cadastrados (user enumeration).
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
          success: false,
          error: "Email ou senha incorretos",
          code: "INVALID_CREDENTIALS",
        });
      }

      // 4. Gerar o Token JWT
      const jwtPayload = { userId: user.id }; // O que queremos guardar no token

      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
        expiresIn: "7d", // Token expira em 7 dias, como especificado
      });

      // 5. Preparar e enviar a resposta
      const responseData: AuthData = {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      };

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
        data: responseData,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({
        success: false,
        error: "Ocorreu um erro interno no servidor.",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

export default router;
