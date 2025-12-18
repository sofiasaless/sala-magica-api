import { Request, Response, Router } from "express";
import { CreateRequest } from "firebase-admin/auth";
import { User } from "../types/user.type";
import { authService } from "../services/auth.service";

const router = Router();

export const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<CreateRequest>
    
    if (body.phoneNumber === '' || body.phoneNumber === undefined) {
      let userToCreate: Omit<User, 'phoneNumber'> = {
        displayName: body.displayName || '',
        email: body.email || '',
        password: body.password || '',
        photoURL: body.photoURL || 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg',
        disabled: false,
        emailVerified: false
      }
      const created = await authService.createNewUser(userToCreate)
      res.status(201).json(created)
      return
    }
    
    const created = await authService.createNewUser(body)
    res.status(201).json(created)
    
    
  } catch (err: any) {
    console.error("createUser error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar usuario" });
  }
}
router.post("/create/user", createUser);

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