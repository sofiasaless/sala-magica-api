import { Request, Response, Router } from "express";
import { Order } from "../types/order.type";
import { orderService } from "../services/order.service";
import { authMiddleware } from "../auth/authMiddleware";

const router = Router()

export const findOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getOrders();
    res.status(200).json(orders)
  } catch (err: any) {
    console.error("listOders error:", err);
    res.status(400).json({ message: `Erro ao listar encomendas: ${err.message}` });
  }
}
router.get("/admin/findAll", authMiddleware('admin'), findOrders)

export const findOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    const order = await orderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (err: any) {
    console.error("findOrderById error:", err);
    res.status(400).json({ message: `Erro ao obter encomenda: ${err.message}` });
  }
}
router.get("/find/:id", authMiddleware('user'), findOrderById)

export const findOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid as string;
    const result = await orderService.getOrdersByUserId(userId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message || `Erro ao buscar encomendas do usuário ${err.message}` });
  }
}
router.get("/findAll", authMiddleware('user'), findOrdersByUser)

export const createOrder = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<Order>;
    const userId = req.user?.uid as string;
    const created = await orderService.createOrder(userId, body);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createOrder error:", err);
    res.status(400).json({ message: err.message || `Erro ao criar encomenda ${err.message}` });
  }
}
router.post("/create", authMiddleware('user'), createOrder)

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id_encomenda = req.params.id as string;
    const body = req.body as Partial<Order>;

    await orderService.updateOrder(id_encomenda, body);
    res.sendStatus(200);
  } catch (err: any) {
    console.error("updateOrder error:", err);
    res.status(400).json({ message: err.message || `Erro ao atualizar encomenda: ${err.message}` });
  }
};
router.put("/admin/update/:id", updateOrder)

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    await orderService.deleteOrder(orderId);
    res.sendStatus(200);
  } catch (err: any) {
    console.error("deleteOrder error:", err);
    res.status(400).json({ message: err.message || `Erro ao deletar encomenda: ${err.message}` });
  }
}
router.delete("/delete/:id", deleteOrder)


export const countOrders = async (req: Request, res: Response) => {
  try {
    const ultimoMes = ((req.query.ultimoMes as string) === 'true')
    const status = req.query.status as string

    const resultado = await orderService.countOrders({
      ultimoMes: ultimoMes,
      status
    });
    res.status(200).json({total: resultado})
  } catch (err: any) {
    console.error("listOders error:", err);
    res.status(400).json({ message: `Erro ao listar encomendas: ${err.message}` });
  }
}
router.get("/admin/count", authMiddleware('admin'), countOrders)

export default router;