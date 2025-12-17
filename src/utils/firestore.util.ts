import { db } from "../config/firebase";
import { DocumentReference, Timestamp } from "firebase-admin/firestore";

export enum COLLECTIONS {
  produtos = "produtos",
  curtidas = "curtidas",
  encomendas = "encomendas",
  usuarios = "usuarios",
  categorias = "categorias",
  dicionario = "dicionario-pesquisa",
  carrinho = "carrinho"
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

function transformFieldValue(value: any): any {
  // Se for Timestamp, converte para Date
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  
  // Se for DocumentReference, extrai o ID
  if (value?.id && typeof value.id === 'string') {
    return value.id || '';
  }
  
  // Se for um array, processa cada elemento
  if (Array.isArray(value)) {
    return value.map(transformFieldValue);
  }
  
  // Mantém outros valores
  return value;
}

export function docToObject<T>(
  id: string, 
  data: FirebaseFirestore.DocumentData
): T {
  const transformedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key, 
      transformFieldValue(value)
    ])
  );
  
  return { ...transformedData, id } as T;
}

