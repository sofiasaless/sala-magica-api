import { Router } from "express";
import {
  listProducts,
  createProduct,
  pageProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";

const router = Router();

router.get("/", listProducts);       // GET /api/products
router.post("/", createProduct);     // POST /api/products
router.get("/page", pageProducts);     // GET /api/products/page
router.put("/update", updateProduct)
router.delete("/delete", deleteProduct)

export default router;
