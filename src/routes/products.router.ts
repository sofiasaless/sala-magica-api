import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";

const router = Router();

router.get("/", listProducts);       // GET /api/products
router.get("/:id", getProduct);      // GET /api/products/:id
router.post("/", createProduct);     // POST /api/products
router.put("/:id", updateProduct);   // PUT /api/products/:id
router.delete("/:id", deleteProduct);// DELETE /api/products/:id

export default router;
