import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { createCategory, findAllCategories } from "../controllers/category.controller";

const router = Router();

// rotas publicas
router.get("/findAll", findAllCategories);

// rotas para o admin
router.post("/create", createCategory);
// router.post("/create", authMiddleware('admin'), createCategory);

export default router;
