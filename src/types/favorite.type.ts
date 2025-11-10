import { DocumentReference } from "firebase-admin/firestore"

export type Favorite = {
  id_favorito?: string,
  id_produto: string | DocumentReference,
  id_usuario: string | DocumentReference,
  data_curtida: Date,
}