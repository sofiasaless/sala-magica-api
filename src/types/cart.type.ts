import { DocumentReference } from "firebase-admin/firestore"

export type ItemCart = {
  id?: string,
  produto_ref: string | DocumentReference,
  usuario_ref: string | DocumentReference,
  quantidade: number,
  data_adicao: Date,
}