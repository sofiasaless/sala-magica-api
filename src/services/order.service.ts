import admin from "firebase-admin";
import { Order, OrderUpdateRequestBody } from "../types/order.type"
import { db } from "../config/firebase";
import { COLLECTIONS, idToDocumentRef } from "../utils/firestore.util";

const COLLECTION = "encomendas"

/**
 * Converte documento Firestore para encomenda normal (inclui id e converte Timestamp -> Date)
 */
function docToOrder(id: string, data: FirebaseFirestore.DocumentData): Order {
  return {
    id,
    altura: data.altura,
    categoria: data.categoria,
    comprimento: data.comprimento,
    descricao: data.descricao,
    imagemReferencia: data.imagemReferencia,
    pendente: data.pendente,
    referencias: data.referencias,
    solicitante: data.solicitante,
    dataEncomenda: data.dataEncomenda && data.dataEncomenda.toDate ? data.dataEncomenda.toDate() : new Date(data.dataEncomenda),
  };
}

export const listOrders = async (): Promise<Order[]> => {
  let query: FirebaseFirestore.Query = db.collection(COLLECTION)
  const snap = await query.orderBy("dataEncomenda", "desc").get();

  const encomendas: Order[] = snap.docs.map(doc => docToOrder(doc.id, doc.data()));
  return encomendas
}

export const createOrder = async (payload: Omit<Order, "id">): Promise<Order> => {
  // validações básicas (pode melhorar com zod/joi)
  if (payload.descricao === undefined) throw new Error("descricao é obrigatória");
  if (payload.solicitante === undefined) throw new Error("solicitante é obrigatório");
  if (payload.categoria === undefined) throw new Error("categoria é obrigatória");

  if (!payload.dataEncomenda) payload.dataEncomenda = new Date();

  const dataToSave = {
    ...payload,
    solicitante: idToDocumentRef(payload.solicitante as string, COLLECTIONS.encomendas),
    dataEncomenda: admin.firestore.Timestamp.fromDate(new Date(payload.dataEncomenda)),
  };

  const ref = await db.collection(COLLECTION).add(dataToSave);
  const doc = await ref.get();
  return docToOrder(doc.id, doc.data()!);
}

export const updateOrder = async (id_encomenda: string, payload: Partial<Order>) => {
  if (id_encomenda === undefined) throw new Error("id da encomenda é necessária para atualização");

  const encomendaRef = db.collection(COLLECTION).doc(id_encomenda);
  const encomendaDoc = await encomendaRef.get();

  if (!encomendaDoc.exists) throw new Error("Encomenda não encontrada");

  const camposNaoPermitidos = ["id", "dataEncomenda", "solicitante"];
  for (const campo of camposNaoPermitidos) {
    if (campo in payload) delete (payload as any)[campo];
  }

  await encomendaRef.update({
    ...payload
  })
}

export const deleteOrder = async (order_id: string) => {
  await db.collection(COLLECTION).doc(order_id).delete();
}

export const getOrderById = async (order_id: string): Promise<Order> => {
  const doc = await db.collection(COLLECTION).doc(order_id).get();
  if (!doc.exists) throw new Error("Encomenda não encontrada");
  return docToOrder(doc.id, doc.data()!);
}