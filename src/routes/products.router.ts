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
router.get("/page", pageProducts);     // GET /api/products/page
router.post("/", createProduct);     // POST /api/products
router.put("/update/:id", updateProduct)
router.delete("/delete/:id", deleteProduct)
router.get("/:id", findProductById);

export default router;
