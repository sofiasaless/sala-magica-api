import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { userService } from "../services/user.service";
import { User } from "../types/user.type";

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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!;
    const body = req.body as Partial<User>
    await userService.updateUser(userId, body);
    res.send(200);
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}
router.put("/update/user", authMiddleware('user'), updateUser)

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!;
    await userService.deleteUser(userId);
    res.send(200);
  } catch (error: any) {
    console.error(error)
    res.status(401).json({ message: error.message })
  }
}
router.delete("/delete/user", authMiddleware('user'), deleteUser)

export default router;