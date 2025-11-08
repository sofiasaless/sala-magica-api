import { Router } from "express";
import { createFavorite, deleteFavorite, listAllFavorites, listFavoritesByUser } from "../controllers/favorite.controller";

const router = Router()

router.get("/", listAllFavorites);
router.get("/:id", listFavoritesByUser);
router.post("/create", createFavorite);
router.delete("/delete/:id", deleteFavorite);

export default router