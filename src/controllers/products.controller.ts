import { Request, Response } from "express";
import * as ProductService from "../services/products.service";
import { Product } from "../types/product.type";

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.listProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error("listProducts error:", err);
    res.status(500).json({ message: "Erro ao listar produtos" });
  }
};

export const findProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id as string;
    const product = await ProductService.getProductById(productId);
    res.status(200).json(product);
  } catch (err: any) {
    res.status(400).json({ message: `Erro ao buscar produto: ${err.message}` });
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<Product>;

    // converter campos conforme necessário (ex: dataAnuncio)
    if (body.dataAnuncio && typeof body.dataAnuncio === "string") {
      body.dataAnuncio = new Date(body.dataAnuncio);
    }

    const created = await ProductService.createProduct(body);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createProduct error:", err);
    res.status(400).json({ message: err.message || `Erro ao criar produto: ${err.message}` });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id_produto = req.params.id as string;
    const body = req.body as Partial<Product>;

    if (id_produto === "") return res.status(400).json({ error: "ID do produto é obrigatório para atualizar" });

    await ProductService.updateProduct(id_produto, body);
    res.sendStatus(200);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Erro ao atualizar produto produto" });
  }
};

export const pageProducts = async (req: Request, res: Response) => {
  try {
    // Extrai query params ?limit=10&startAfter=abc123
    const limit = Number(req.query.limit) || 8;
    // filtros de pesquisa
    const categoria = req.query.categoria as string | undefined;
    const ordem = (req.query.ordem as string) ?? "dataAnuncio";

    const cursor = req.query.cursor as string | undefined;      // próximo
    const cursorPrev = req.query.cursorPrev as string | undefined; // anterior

    const data = await ProductService.pageProducts({
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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product_id = req.params.id as string;
    await ProductService.deleteProduct(product_id)
    res.sendStatus(200);
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(400).json({ message: "Erro ao deletar produto" });
  }
}

export const countTotalProducts = async (req: Request, res: Response) => {
  try {
    const categoria_filtro = req.query.categoria as string
    const total = await ProductService.countProducts(categoria_filtro)
    res.status(200).json({ total: total })
  } catch (error) {
    res.status(400).json({ message: "Erro ao contar total de produtos" })
  }
}
