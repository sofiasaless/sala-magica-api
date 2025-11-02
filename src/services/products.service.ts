import { v4 as uuidv4 } from "uuid";

type Product = {
  id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  active?: boolean;
  createdAt: string;
};

const db: Product[] = []; // "db" em memória

export const list = (): Product[] => db.filter(p => p.active !== false);

export const get = (id: string): Product | undefined => db.find(p => p.id === id);

export const create = (payload: Partial<Product>): Product => {
  const product: Product = {
    id: uuidv4(),
    title: payload.title || "Sem título",
    description: payload.description || "",
    price: payload.price ?? 0,
    images: payload.images || [],
    active: payload.active ?? true,
    createdAt: new Date().toISOString(),
  };
  db.push(product);
  return product;
};

export const update = (id: string, patch: Partial<Product>): Product | null => {
  const idx = db.findIndex(p => p.id === id);
  if (idx === -1) return null;
  db[idx] = { ...db[idx], ...patch };
  return db[idx];
};

export const remove = (id: string): boolean => {
  const idx = db.findIndex(p => p.id === id);
  if (idx === -1) return false;
  db.splice(idx, 1);
  return true;
};
