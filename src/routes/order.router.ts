import { Router } from "express";
import { createOrder, deleteOrder, findOrderById, listOrder, updateOrder } from "../controllers/orders.controller";

const router = Router()

router.get("/", listOrder)
router.get("/:id", findOrderById)
router.post("/create", createOrder)
router.put("/update", updateOrder)
router.delete("/delete/:id", deleteOrder)

export default router