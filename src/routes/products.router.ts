import { Router } from "express";
import {
  listProducts,
  createProduct,
  pageProducts,
  updateProduct,
  deleteProduct,
  findProductById,
} from "../controllers/products.controller";

const router = Router();

router.get("/", listProducts);       // GET /api/products
router.get("/:id", findProductById);
router.post("/", createProduct);     // POST /api/products
router.get("/page", pageProducts);     // GET /api/products/page
router.put("/update", updateProduct)
router.delete("/delete/:id", deleteProduct)

export default router;
