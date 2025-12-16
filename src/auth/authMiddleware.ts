import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";


export function authMiddleware(requiredRole?: "admin" | "user") {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getTokenFromHeaders(req);

      const decoded = await admin.auth().verifyIdToken(token);

      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        role: decoded.role,
      };

      if (requiredRole && decoded.role !== requiredRole) return res.status(403).json({ message: "Acesso negado." });

      return next();
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  };
}

function getTokenFromHeaders(req: Request) {
  const header = req.headers.authorization

  if (!header) throw new Error("Token não identificado")

  const [, token] = header.split(" ");
  return token
}