import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { createOrder, deleteOrder, findOrderById, findOrders, findOrdersByUser, updateOrder } from "../controllers/orders.controller";

const router = Router()

// rotas para o usuario administrador da sala magica
router.get("/admin/list", authMiddleware('admin'), findOrders)
router.put("/update/:id", updateOrder)
router.delete("/delete/:id", deleteOrder)

// rotas para quem está autenticado
router.get("/find/:id", authMiddleware('user'), findOrderById)
router.get("/findAll", authMiddleware('user'), findOrdersByUser)
router.post("/create", authMiddleware('user'), createOrder)

export default router