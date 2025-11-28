import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

export async function authMiddleware(requiredRole?: "admin" | "user") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromHeaders(req);

    try {
      const decoded = await admin.auth().verifyIdToken(token);

      // anexar usuário à requisição
      (req as any).user = decoded;

      // verificar role se necessário
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: "Permissão negada" });
      }

      return next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
}

function getTokenFromHeaders(req: Request) {
  const header = req.headers.authorization

  if (!header) throw new Error("Token não identificado")

  const [, token] = header.split(" ");
  return token
}