import { Request, Response, Router } from "express";
import { categoryService } from "../services/category.service";
import { Category } from "../types/categoria.type";

const router = Router();

export const createCategory = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<Category>;
    const created = await categoryService.createCategory(body);
    res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}
router.post("/create", createCategory);

export const findAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.findAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar favoritos" });
  }
}
router.get("/findAll", findAllCategories);

export default router;