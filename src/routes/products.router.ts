import { Router } from "express";
import {
  listProducts,
  createProduct,
  pageProducts,
  updateProduct,
  deleteProduct,
  findProductById,
  countTotalProducts,
} from "../controllers/products.controller";
import { authMiddleware } from "../auth/authMiddleware";

const router = Router();

// rotas publicas
router.get("/", listProducts);       // GET /api/products
router.get("/page", pageProducts);     // GET /api/products/page
router.get("/count", countTotalProducts);     // GET /api/products/page
router.get("/find/:id", findProductById);

// rotas para o admin
router.post("/", authMiddleware('admin'), createProduct);     // POST /api/products
router.put("/update/:id", authMiddleware('admin'), updateProduct)
router.delete("/delete/:id", authMiddleware('admin'), deleteProduct)

export default router;
