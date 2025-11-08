import { db } from "../config/firebase";
import { DocumentReference } from "firebase-admin/firestore";

export enum COLLECTIONS {
  produtos = "produtos",
  curtidas = "curtidas",
  encomendas = "encomendas",
  usuarios = "usuarios",
}

/**
 * retorna uma referência de documento no Firestore a partir do ID e da coleção.
 * @param id ID do documento
 * @param collection Nome da coleção
 * @returns DocumentReference
 */
export function idToDocumentRef(id: string, collection: COLLECTIONS): DocumentReference {
  return db.collection(collection).doc(id);
}
