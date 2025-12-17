import { Request, Response } from "express";
import { carService } from "../services/cart.service";

export const findItemsCartByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!;
    const result = await carService.findCartItems(userId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: `Erro ao listar itens do carrinho: ${err.message}` });
  }
}

export const deleteItemCart = async (req: Request, res: Response) => {
  try {
    const idItem = req.params.idItem;
    await carService.remove(idItem);
    res.status(200).json({ message: "Item removido com sucesso do carrinho" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export const deleteAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!;
    await carService.removeAll(userId);
    res.sendStatus(200).json({ message: "Carrinho limpo com sucesso" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export const cartAction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!
    const idProduto = req.params.idProduto;
    const quantidade = Number(req.params.qtd)

    const created = await carService.doCartAction(userId, idProduto, quantidade);
    res.status(200).json(created);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export const updateItemQuantity = async (req: Request, res: Response) => {
  try {
    const idItem = req.params.idItem;
    const quantidade = Number(req.params.qtd)

    await carService.updateQuantity(idItem, quantidade)
    res.sendStatus(200)
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}