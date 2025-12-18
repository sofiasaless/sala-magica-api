import { Request, Response, Router } from "express";
import { favoriteService } from "../services/favorite.service";
import { authMiddleware } from "../auth/authMiddleware";

const router = Router()

export const createFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!
    const idProduto = req.params.idProduto;

    const created = await favoriteService.createFavorite(userId, idProduto);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createFavorite error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar favorito" });
  }
}
router.post("/create/:idProduto", authMiddleware('user'), createFavorite);

export const findAllFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await favoriteService.getAllFavorites();
    res.status(200).json(favorites);
  } catch (err) {
    console.error("listFavorites error:", err);
    res.status(500).json({ message: "Erro ao listar favoritos" });
  }
}
router.get("/admin/findAll", authMiddleware('admin'), findAllFavorites);

export const findFavoritesProductsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!;
    const favorites = await favoriteService.getFavoritesProductsByUserId(userId);
    res.status(200).json(favorites);
  } catch (err: any) {
    console.error("listFavoritesByUser error:", err);
    res.status(500).json({ message: `Erro ao listar favoritos do usuário ${err.message}` });
  }
}
router.get("/findAll", authMiddleware('user'), findFavoritesProductsByUser);

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!
    const idProduto = req.params.idProduto;
    await favoriteService.deleteFavorite(userId, idProduto);
    res.status(200).json({ message: "Favorito deletado com sucesso" });
  } catch (err: any) {
    console.error("deleteFavorite error:", err);
    res.status(400).json({ message: err.message || "Erro ao deletar favorito" });
  }
}
router.delete("/delete/:idProduto", authMiddleware('user'), deleteFavorite);

export const favoriteAction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!
    const idProduto = req.params.idProduto;

    const created = await favoriteService.doFavoriteAction(userId, idProduto);
    res.status(200).json(created);
  } catch (err: any) {
    console.error("createFavorite error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar favorito" });
  }
}
router.post("/favAction/:idProduto", authMiddleware('user'), favoriteAction);

export default router;