import { Request, Response } from "express";
import * as ProductService from "../services/products.service";

export const listProducts = (req: Request, res: Response) => {
  const products = ProductService.list();
  res.json(products);
};

export const getProduct = (req: Request, res: Response) => {
  const product = ProductService.get(req.params.id);
  if (!product) return res.status(404).json({ message: "Produto não encontrado" });
  res.json(product);
};

export const createProduct = (req: Request, res: Response) => {
  const data = req.body;
  const created = ProductService.create(data);
  res.status(201).json(created);
};

export const updateProduct = (req: Request, res: Response) => {
  const updated = ProductService.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Produto não encontrado" });
  res.json(updated);
};

export const deleteProduct = (req: Request, res: Response) => {
  const ok = ProductService.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: "Produto não encontrado" });
  res.status(204).send();
};
