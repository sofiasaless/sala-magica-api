import { Request, Response } from "express";
import * as FavoriteService from "../services/favorite.service";

export const createFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!
    const idProduto = req.params.idProduto;

    const created = await FavoriteService.createFavorite(userId, idProduto);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createFavorite error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar favorito" });
  }
}

export const findAllFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await FavoriteService.getAllFavorites();
    res.status(200).json(favorites);
  } catch (err) {
    console.error("listFavorites error:", err);
    res.status(500).json({ message: "Erro ao listar favoritos" });
  }
}

export const findFavoritesProductsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!;
    const favorites = await FavoriteService.getFavoritesProductsByUserId(userId);
    res.status(200).json(favorites);
  } catch (err: any) {
    console.error("listFavoritesByUser error:", err);
    res.status(500).json({ message: `Erro ao listar favoritos do usuário ${err.message}` });
  }
}

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!
    const idProduto = req.params.idProduto;
    await FavoriteService.deleteFavorite(userId, idProduto);
    res.status(200).json({ message: "Favorito deletado com sucesso" });
  } catch (err: any) {
    console.error("deleteFavorite error:", err);
    res.status(400).json({ message: err.message || "Erro ao deletar favorito" });
  }
}

export const favoriteAction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid!
    const idProduto = req.params.idProduto;

    const created = await FavoriteService.doFavoriteAction(userId, idProduto);
    res.status(200).json(created);
  } catch (err: any) {
    console.error("createFavorite error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar favorito" });
  }
}