import { Request, Response } from "express";
import { OrderAwnserNotificationPayload } from "../types/notification.type";
import { notificationService } from "../services/notification.service";

export const createOrderAwnserNotification = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<OrderAwnserNotificationPayload>;
    await notificationService.createRespostaEncomendaNotificacao(body as OrderAwnserNotificationPayload);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar notificação de resposta de encomenda" });
  }
}

export const listNotifications = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.params.id;
    const lidas = req.query.lidas === "true";

    const notifications = await notificationService.getNotificationsByUserId(id_usuario, !lidas);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar notificações do usuario" });
  } 
}