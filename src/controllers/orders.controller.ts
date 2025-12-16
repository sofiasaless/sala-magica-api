import { Request, Response } from "express";
import * as OrderService from '../services/order.service';
import { Order } from "../types/order.type";

export const findOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getOrders();
    res.status(200).json(orders)
  } catch (err: any) {
    console.error("listOders error:", err);
    res.status(400).json({ message: `Erro ao listar produtos: ${err.message}` });
  }
}

export const findOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    const order = await OrderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (err: any) {
    console.error("findOrderById error:", err);
    res.status(400).json({ message: `Erro ao obter encomenda: ${err.message}` });
  }
}

export const findOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid as string;
    const result = await OrderService.getOrdersByUserId(userId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message || `Erro ao buscar encomendas do usuário ${err.message}` });
  }
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<Order>;
    const userId = req.user?.uid as string;
    const created = await OrderService.createOrder(userId, body);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createOrder error:", err);
    res.status(400).json({ message: err.message || `Erro ao criar encomenda ${err.message}` });
  }
}

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id_encomenda = req.params.id as string;
    const body = req.body as Partial<Order>;

    if (id_encomenda === "") return res.status(400).json({ error: `ID da encomenda é obrigatório` });

    await OrderService.updateOrder(id_encomenda, body);
    res.sendStatus(200);
  } catch (err: any) {
    console.error("updateOrder error:", err);
    res.status(400).json({ message: err.message || `Erro ao atualizar encomenda: ${err.message}` });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    await OrderService.deleteOrder(orderId);
    res.sendStatus(200);
  } catch (err: any) {
    console.error("deleteOrder error:", err);
    res.status(400).json({ message: err.message || `Erro ao deletar encomenda: ${err.message}` });
  }
}