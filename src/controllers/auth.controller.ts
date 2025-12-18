import { Request, Response, Router } from "express";
import { CreateRequest } from "firebase-admin/auth";
import { User } from "../types/user.type";
import { authService } from "../services/auth.service";
import { authMiddleware } from "../auth/authMiddleware";

const router = Router();

export const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<CreateRequest>
    let userToCreate: Partial<User> = {
      displayName: body.displayName || '',
      email: body.email || '',
      photoURL: body.photoURL || 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg',
      password: body.password || '',
      disabled: false,
      emailVerified: false
    }

    if (body.phoneNumber !== '' && body.phoneNumber !== undefined && body.phoneNumber !== null) {
      userToCreate.phoneNumber = body.phoneNumber
    }

    const created = await authService.createNewUser(body, "user")
    res.status(201).json(created)


  } catch (err: any) {
    console.error("createUser error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar usuario" });
  }
}
router.post("/create/user", createUser);

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<CreateRequest>
    let userToCreate: Partial<User> = {
      displayName: body.displayName || '',
      email: body.email || '',
      photoURL: body.photoURL || 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg',
      password: body.password || '',
      disabled: false,
      emailVerified: false
    }

    if (body.phoneNumber !== '' && body.phoneNumber !== undefined && body.phoneNumber !== null) {
      userToCreate.phoneNumber = body.phoneNumber
    }

    const created = await authService.createNewUser(body, "admin")
    res.status(201).json(created)

  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
router.post("/create/admin", authMiddleware('admin'), createAdmin);

export const verifyAdmin = async (req: Request, res: Response) => {
  try {
    res.sendStatus(200);
  } catch (error: any) {
    res.status(401).json({ message: error.message });    
  }
}
router.get("/admin/verify", authMiddleware('admin'), verifyAdmin)

export const testToken = async (req: Request, res: Response) => {
  try {
    const header = req.headers.authorization

    if (!header) throw new Error("Token não identificado")

    const [, token] = header.split(" ");

    const response = await authService.verifyIdToken(token)
    res.status(200).json({ email: response })

  } catch (error: any) {
    console.error('erro ao testar token ', error)
    res.status(400).json({ message: error.message || "Erro ao testar token" });
  }
}
router.get("/test", testToken);

export default router;