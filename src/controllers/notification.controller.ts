import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { notificationService } from "../services/notification.service";

const router = Router();
export default router;

export const listNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!;
    const lidas = req.query.lidas === "true";

    const notifications = await notificationService.findNotificationsByUserId(userId, !lidas);
    res.status(200).json(notifications);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  } 
}
router.get("/findAll", authMiddleware('user'), listNotifications);

export const markAsReaded = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await notificationService.markAsRead(id);
    res.send(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  } 
}
router.put("/read/:id", authMiddleware('user'), markAsReaded);