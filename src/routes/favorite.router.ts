import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { createFavorite, deleteFavorite, favoriteAction, findAllFavorites, findFavoritesProductsByUser } from "../controllers/favorite.controller";

const router = Router()

router.get("/admin/findAll", authMiddleware('admin'), findAllFavorites);

// rotas para usuarios que estiverem autenticados
router.get("/findAll", authMiddleware('user'), findFavoritesProductsByUser);
router.post("/create/:idProduto", authMiddleware('user'), createFavorite);
router.delete("/delete/:idProduto", authMiddleware('user'), deleteFavorite);
router.post("/favAction/:idProduto", authMiddleware('user'), favoriteAction);

export default router