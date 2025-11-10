import { Router } from "express";
import { createOrderAwnserNotification, listNotifications } from "../controllers/notification.controller";

const router = Router();

router.post("/order-answer", createOrderAwnserNotification);
router.get("/list/:id", listNotifications);

export default router;