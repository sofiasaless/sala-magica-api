import { Request, Response } from "express";
import * as FavoriteService from "../services/favorite.service";
import { Favorite } from "../types/favorite.type";

export const createFavorite = async (req: Request, res: Response) => {
  try {
    // posteriormente o id do usuario terá de vir pelo token de autenticação, e não pelo body
    // .......

    const body = req.body as Omit<Favorite, "id_favorito">;

    // data vindo automaticamente no backend
    body.data_curtida = new Date();

    const created = await FavoriteService.createFavorite(body);  
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createFavorite error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar favorito" });
  }
}

export const listAllFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await FavoriteService.getAllFavorites();
    res.status(200).json(favorites);
  } catch (err) {
    console.error("listFavorites error:", err);
    res.status(500).json({ message: "Erro ao listar favoritos" });
  }
}

export const listFavoritesByUser = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.params.id;
    const favorites = await FavoriteService.getFavoritesByUserId(id_usuario);
    res.status(200).json(favorites);
  } catch (err) {
    console.error("listFavoritesByUser error:", err);
    res.status(500).json({ message: "Erro ao listar favoritos do usuário" });
  }
}

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const body = req.body as Favorite;
    await FavoriteService.deleteFavorite(body);
    res.status(200).json({ message: "Favorito deletado com sucesso" });
  } catch (err: any) {
    console.error("deleteFavorite error:", err);
    res.status(400).json({ message: err.message || "Erro ao deletar favorito" });
  }
}