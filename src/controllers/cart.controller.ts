import { Request, Response, Router } from "express";
import { cartService } from "../services/cart.service";
import { authMiddleware } from "../auth/authMiddleware";

const router = Router()

export const findItemsCartByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!;
    const result = await cartService.findCartItems(userId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: `Erro ao listar itens do carrinho: ${err.message}` });
  }
}
router.get("/findAll", authMiddleware('user'), findItemsCartByUser);

export const deleteItemCart = async (req: Request, res: Response) => {
  try {
    const idItem = req.params.idItem;
    await cartService.remove(idItem);
    res.status(200).json({ message: "Item removido com sucesso do carrinho" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
router.delete("/delete/:idItem", authMiddleware('user'), deleteItemCart);

export const deleteAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!;
    await cartService.removeAll(userId);
    res.sendStatus(200).json({ message: "Carrinho limpo com sucesso" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
router.delete("/deleteAll", authMiddleware('user'), deleteAll);

export const cartAction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!
    const idProduto = req.params.idProduto;
    const quantidade = Number(req.params.qtd)

    const created = await cartService.doCartAction(userId, idProduto, quantidade);
    res.status(200).json(created);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
router.post("/cartAction/:idProduto/:qtd", authMiddleware('user'), cartAction);

export const updateItemQuantity = async (req: Request, res: Response) => {
  try {
    const idItem = req.params.idItem;
    const quantidade = Number(req.params.qtd)

    await cartService.updateQuantity(idItem, quantidade)
    res.sendStatus(200)
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
router.put("/itemCart/update/:idItem/:qtd", authMiddleware('user'), updateItemQuantity);

export default router
