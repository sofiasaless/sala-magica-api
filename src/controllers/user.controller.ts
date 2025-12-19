import { Request, Response, Router } from "express";
import { CreateRequest } from "firebase-admin/auth";
import { User } from "../types/user.type";
import { authService } from "../services/auth.service";
import { authMiddleware } from "../auth/authMiddleware";
import { userService } from "../services/user.service";

const router = Router();

export const countUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.countUsers()
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });    
  }
}
router.get("/admin/count", authMiddleware('admin'), countUsers)

export const findById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string
    const result = await userService.findById(userId)
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });    
  }
}
router.get("/admin/find/:id", authMiddleware('admin'), findById)

export default router;