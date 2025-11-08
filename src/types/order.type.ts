import { DocumentReference } from "firebase-admin/firestore"

export type Order = {
  id?: string,
  categoria: string,
  altura?: number,
  comprimento?: number,
  descricao: string,
  pendente: boolean,
  imagemReferencia?: string,
  referencias?: [],
  solicitante: string | DocumentReference,
  dataEncomenda: Date
}

export type OrderUpdateRequestBody = {
  id: string,
  categoria?: string,
  altura?: number,
  comprimento?: number,
  descricao?: string,
  pendente?: boolean,
  imagemReferencia?: string,
  referencias?: [],
}