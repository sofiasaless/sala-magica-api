import { Request, Response } from "express";
import * as ProductService from "../services/products.service";
import { Product, ProductUpdateRequestBody } from "../types/product.type";

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.listProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error("listProducts error:", err);
    res.status(500).json({ message: "Erro ao listar produtos" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<Product>;

    // converter campos conforme necessário (ex: dataAnuncio)
    if (body.dataAnuncio && typeof body.dataAnuncio === "string") {
      body.dataAnuncio = new Date(body.dataAnuncio);
    }
    // preencher defaults mínimos
    const toCreate: Omit<Product, "id"> = {
      titulo: body.titulo || "",
      descricao: body.descricao || "",
      preco: body.preco ?? 0,
      modelagem: body.modelagem || "",
      categoria: body.categoria || "",
      altura: body.altura || 0,
      comprimento: body.comprimento || 0,
      imagemCapa: body.imagemCapa || "",
      imagens: body.imagens || [],
      ativo: body.ativo ?? true,
      dataAnuncio: body.dataAnuncio ?? new Date(),
    };

    const created = await ProductService.createProduct(toCreate);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("createProduct error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar produto" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body as Partial<ProductUpdateRequestBody>;

    if (body != undefined) {
      if (body.id === undefined) throw new Error("id do produto é necessário para atualização");

      // preencher defaults mínimos
      const toUpdate: ProductUpdateRequestBody = {
        id: body.id,
        ...body
      };
      console.info('conteudo do body ', toUpdate)
      await ProductService.updateProduct(toUpdate);
      res.sendStatus(200);
    }
  } catch (err: any) {
    console.error("createProduct error:", err);
    res.status(400).json({ message: err.message || "Erro ao criar produto" });
  }
};

export const pageProducts = async (req: Request, res: Response) => {
  try {
    // Extrai query params ?limit=10&startAfter=abc123
    const limit = parseInt(req.query.limit as string) || 10;
    const startAfter = req.query.startAfter as string | undefined;

    const data = await ProductService.pageProducts(limit, startAfter);
    res.status(200).json(data);
  } catch (err) {
    console.error("pageProducts error:", err);
    res.status(500).json({ message: "Erro ao paginar produtos" });
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product_id = req.query.id as string;
    await ProductService.deleteProduct(product_id)
    res.sendStatus(200);
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ message: "Erro ao deletar produto" });
  }
}
