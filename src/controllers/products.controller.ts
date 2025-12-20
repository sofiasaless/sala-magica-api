import { Request, Response, Router } from "express";
import { Product } from "../types/product.type";
import { productService } from "../services/products.service";
import { authMiddleware } from "../auth/authMiddleware";

const router = Router();

export default router;

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.listProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error("listProducts error:", err);
    res.status(500).json({ message: "Erro ao listar produtos" });
  }
};
router.get("/", listProducts);

export const findProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id as string;
    const product = await productService.getProductById(productId);
    res.status(200).json(product);
  } catch (err: any) {
    res.status(400).json({ message: `Erro ao buscar produto: ${err.message}` });
  }
}
router.get("/find/:id", findProductById);

export const createProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<Product>;

    const created = await productService.createProduct(body);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createProduct error:", err);
    res.status(400).json({ message: err.message || `Erro ao criar produto: ${err.message}` });
  }
};
router.post("/admin", authMiddleware('admin'), createProduct);

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id_produto = req.params.id as string;
    const body = req.body as Partial<Product>;

    if (id_produto === "") return res.status(400).json({ error: "ID do produto é obrigatório para atualizar" });

    await productService.updateProduct(id_produto, body);
    res.send(200);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
router.put("/admin/update/:id", authMiddleware('admin'), updateProduct)

export const pageProducts = async (req: Request, res: Response) => {
  try {
    // Extrai query params ?limit=10&startAfter=abc123
    const limit = Number(req.query.limit) || 8;
    // filtros de pesquisa
    const categoria = req.query.categoria as string | undefined;
    const ordem = (req.query.ordem as string) ?? "dataAnuncio";

    const cursor = req.query.cursor as string | undefined;      // próximo
    const cursorPrev = req.query.cursorPrev as string | undefined; // anterior

    const data = await productService.pageProducts({
      limit,
      categoria,
      ordem,
      cursor,
      cursorPrev,
    });

    return res.status(200).json(data);
  } catch (err: any) {
    res.status(400).json({ message: `Erro ao paginar produtos ${err.message}` });
  }
}
router.get("/page", pageProducts)

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product_id = req.params.id as string;
    await productService.deleteProduct(product_id)
    res.sendStatus(200);
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(400).json({ message: "Erro ao deletar produto" });
  }
}
router.delete("/admin/delete/:id", authMiddleware('admin'), deleteProduct)

export const countTotalProducts = async (req: Request, res: Response) => {
  try {
    const categoria_filtro = req.query.categoria as string
    const ativo = ((req.query.ativo as string) === 'true') 

    const total = await productService.countProducts({
      categoria: categoria_filtro,
      ativo: ativo
    })
    res.status(200).json({ total: total })
  } catch (error) {
    res.status(400).json({ message: "Erro ao contar total de produtos" })
  }
}
router.get("/count", countTotalProducts);