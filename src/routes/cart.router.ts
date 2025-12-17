import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { cartAction, deleteAll, deleteItemCart, findItemsCartByUser, updateItemQuantity } from "../controllers/cart.controller";

const router = Router()

// rotas para usuarios que estiverem autenticados
router.get("/findAll", authMiddleware('user'), findItemsCartByUser);
router.delete("/delete/:idItem", authMiddleware('user'), deleteItemCart);
router.delete("/deleteAll", authMiddleware('user'), deleteAll);
router.post("/cartAction/:idProduto/:qtd", authMiddleware('user'), cartAction);
router.put("/itemCart/update/:idItem/:qtd", authMiddleware('user'), updateItemQuantity);

export default router