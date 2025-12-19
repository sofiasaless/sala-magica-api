import { DocumentReference } from "firebase-admin/firestore"

export type Order = {
  id?: string,
  categoria_reference: string | DocumentReference,
  altura?: number,
  comprimento?: number,
  descricao: string,
  pendente: boolean,
  imagemReferencia?: string[],
  referencias?: string,
  solicitante: string | DocumentReference,
  status: OrderStatus,
  dataEncomenda: Date
}

export type OrderStatus = 'EM ANÁLISE' | 'EM PRODUÇÃO' | 'CANCELADO' | 'FINALIZADO'