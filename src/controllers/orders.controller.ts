import { Request, Response } from "express";
import * as OrderService from '../services/order.service'
import { Order, OrderUpdateRequestBody } from "../types/order.type";

export const listOrder = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.listOrders();
    res.status(200).json(orders)
  } catch (err) {
    console.error("listOders error:", err);
    res.status(500).json({ message: "Erro ao listar produtos" });
  }
}

export const findOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    const order = await OrderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (err) {
    console.error("findOrderById error:", err);
    res.status(500).json({ message: "Erro ao obter encomenda" });
  }
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<Order>;

    // converter campos conforme necessário (ex: dataAnuncio)
    if (body.dataEncomenda && typeof body.dataEncomenda === "string") {
      body.dataEncomenda = new Date(body.dataEncomenda);
    }

    // preencher defaults mínimos
    const toCreate: Omit<Order, "id"> = {
      categoria: body.categoria || "",
      descricao: body.descricao || "",
      pendente: true,
      solicitante: body.solicitante || "",
      altura: body.altura,
      comprimento: body.comprimento,
      imagemReferencia: body.imagemReferencia,
      referencias: body.referencias || [],
      dataEncomenda: body.dataEncomenda ?? new Date(),
    };
    const created = await OrderService.createOrder(toCreate);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createOrder error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar encomenda" });
  }
}

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id_encomenda = req.params.id as string;
    const body = req.body as Partial<Order>;

    if (id_encomenda === "") return res.status(400).json({ error: "ID da encomenda é obrigatório" });

    await OrderService.updateOrder(id_encomenda, body);
    res.sendStatus(200);
  } catch (err: any) {
    console.error("updateOrder error:", err);
    res.status(400).json({ message: err.message || "Erro ao atualizar encomenda" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    await OrderService.deleteOrder(orderId);
    res.sendStatus(200);
  } catch (err: any) {
    console.error("deleteOrder error:", err);
    res.status(400).json({ message: err.message || "Erro ao deletar encomenda" });
  }
}