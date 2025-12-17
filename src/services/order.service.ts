import { db } from "../config/firebase";
import { Order, OrderStatus } from "../types/order.type";
import { COLLECTIONS, idToDocumentRef } from "../utils/firestore.util";
import { eventBus, eventNames } from "./eventBus";

const COLLECTION = "encomendas"

/**
 * Converte documento Firestore para encomenda normal (inclui id e converte Timestamp -> Date)
 */
function docToOrder(id: string, data: FirebaseFirestore.DocumentData): Order {
  return {
    id,
    altura: data.altura,
    categoria_reference: data.categoria_reference?.id || '',
    comprimento: data.comprimento,
    descricao: data.descricao,
    imagemReferencia: data.imagemReferencia,
    pendente: data.pendente,
    referencias: data.referencias,
    solicitante: data.solicitante?.id || '',
    data_envio: data.data_envio && data.data_envio.toDate ? data.data_envio.toDate() : new Date(data.data_envio),
  };
}

export const getOrders = async (): Promise<Order[]> => {
  let query: FirebaseFirestore.Query = db.collection(COLLECTION)
  const snap = await query.orderBy("data_envio", "desc").get();

  const encomendas: Order[] = snap.docs.map(doc => docToOrder(doc.id, doc.data()));
  return encomendas
}

export const createOrder = async (id_usuario: string, payload: Partial<Order>): Promise<Order> => {
  // validações básicas (pode melhorar com zod/joi)
  if (payload.descricao === undefined) throw new Error("Descricao é obrigatória");
  if (payload.categoria_reference === undefined) throw new Error("Categoria é obrigatória");

  const dataToSave = {
    ...payload,
    status: 'EM ANÁLISE' as OrderStatus,
    categoria_reference: idToDocumentRef(payload.categoria_reference as string, COLLECTIONS.categorias),
    solicitante: idToDocumentRef(id_usuario as string, COLLECTIONS.usuarios),
    data_envio: new Date(),
  };

  const ref = await db.collection(COLLECTION).add(dataToSave);
  const doc = await ref.get();
  const encomenda = docToOrder(doc.id, doc.data()!);

  // disparando o envento de nova encomenda criada
  await eventBus.emit(eventNames.ENCOMENDA_CRIADA, encomenda);
  
  return encomenda
}

export const updateOrder = async (id_encomenda: string, payload: Partial<Order>) => {
  if (id_encomenda === undefined) throw new Error("id da encomenda é necessária para atualização");

  const encomendaRef = db.collection(COLLECTION).doc(id_encomenda);
  const encomendaDoc = await encomendaRef.get();

  if (!encomendaDoc.exists) throw new Error("Encomenda não encontrada");

  const camposNaoPermitidos = ["id", "data_envio", "solicitante"];
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

export const getOrdersByUserId = async (id_usuario: string): Promise<Order[]> => {
  const ordersSnap = await db.collection(COLLECTION).where("solicitante", "==", idToDocumentRef(id_usuario, COLLECTIONS.usuarios)).get()

  if (ordersSnap.empty) return []

  const encomendasEncontradas: Order[] = ordersSnap.docs.map((order) => {
    return docToOrder(order.id, order.data())
  })

  return encomendasEncontradas;
}