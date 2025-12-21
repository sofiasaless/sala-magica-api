import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { notificationService, ResponseOrderNotificationFields } from "../services/notification.service";

const router = Router();
export default router;

export const createOrderAwnserNotification = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<ResponseOrderNotificationFields>;
    const response = await notificationService.createRespostaEncomendaNotificacao(body as ResponseOrderNotificationFields);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ message: `Erro ao criar notificação: ${error.message}` });
  }
}
router.post("/order-answer", authMiddleware('admin'), createOrderAwnserNotification);

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