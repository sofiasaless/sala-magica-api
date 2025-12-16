import { DocumentReference } from "firebase-admin/firestore";

export type Product = {
  id?: string;
  titulo: string;
  descricao: string;
  preco: number;
  modelagem: string;
  categoria: string;
  categoria_reference: string | DocumentReference;
  altura?: number;
  comprimento?: number;
  imagemCapa?: string;
  imagens?: string[];
  ativo: boolean;
  dataAnuncio: Date;
};

export type ProductUpdateRequestBody = {
  id: string;
  titulo?: string;
  descricao?: string;
  preco?: number;
  modelagem?: string;
  categoria_reference?: string;
  categoria?: string;
  altura?: number;
  comprimento?: number;
  imagemCapa?: string;
  imagens?: string[];
  ativo?: boolean;
};