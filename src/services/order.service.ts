import { Timestamp } from "firebase-admin/firestore";
import { Order, OrderStatus } from "../types/order.type";
import { COLLECTIONS, idToDocumentRef } from "../utils/firestore.util";
import { eventBus, eventNames } from "./eventBus";
import { PatternService } from "./pattern.service";

interface FilterProps {
  ultimoMes?: boolean,
  status?: string
}

class OrderService extends PatternService {
  constructor() {
    super(COLLECTIONS.encomendas)
  }

  /**
   * Converte documento Firestore para encomenda normal (inclui id e converte Timestamp -> Date)
   */
  private docToOrder(id: string, data: FirebaseFirestore.DocumentData): Order {
    return {
      id,
      altura: data.altura,
      categoria_reference: data.categoria_reference?.id || '',
      comprimento: data.comprimento,
      descricao: data.descricao,
      imagemReferencia: data.imagemReferencia,
      pendente: data.pendente,
      referencias: data.referencias,
      status: data.status,
      solicitante: data.solicitante?.id || '',
      dataEncomenda: data.dataEncomenda && data.dataEncomenda.toDate ? data.dataEncomenda.toDate() : new Date(data.data_envio),
    };
  }

  public async getOrders(): Promise<Order[]> {
    let query: FirebaseFirestore.Query = this.setup()
    const snap = await query.orderBy("dataEncomenda", "desc").get();

    const encomendas: Order[] = snap.docs.map(doc => this.docToOrder(doc.id, doc.data()));
    return encomendas
  }

  public async createOrder(id_usuario: string, payload: Partial<Order>): Promise<Order> {
    // validações básicas (pode melhorar com zod/joi)
    if (payload.descricao === undefined) throw new Error("Descricao é obrigatória");
    if (payload.categoria_reference === undefined) throw new Error("Categoria é obrigatória");

    const dataToSave = {
      ...payload,
      status: 'NOVA' as OrderStatus,
      categoria_reference: idToDocumentRef(payload.categoria_reference as string, COLLECTIONS.categorias),
      solicitante: idToDocumentRef(id_usuario as string, COLLECTIONS.usuarios),
      dataEncomenda: new Date(),
    };

    const ref = await this.setup().add(dataToSave);
    const doc = await ref.get();
    const encomenda = this.docToOrder(doc.id, doc.data()!);

    // disparando o envento de nova encomenda criada
    await eventBus.emit(eventNames.ENCOMENDA_CRIADA, encomenda);

    return encomenda
  }

  public async updateOrder(id_encomenda: string, payload: Partial<Order>) {
    if (id_encomenda === undefined || id_encomenda === '') throw new Error("ID da encomenda é necessária para atualização");

    const encomendaRef = this.setup().doc(id_encomenda);
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

  public async deleteOrder(order_id: string) {
    await this.setup().doc(order_id).delete();
  }

  public async getOrderById(order_id: string): Promise<Order> {
    const doc = await this.setup().doc(order_id).get();
    if (!doc.exists) throw new Error("Encomenda não encontrada");
    return this.docToOrder(doc.id, doc.data()!);
  }

  public async getOrdersByUserId(id_usuario: string): Promise<Order[]> {
    const ordersSnap = await this.setup().where("solicitante", "==", idToDocumentRef(id_usuario, COLLECTIONS.usuarios)).get()

    if (ordersSnap.empty) return []

    const encomendasEncontradas: Order[] = ordersSnap.docs.map((order) => {
      return this.docToOrder(order.id, order.data())
    })

    return encomendasEncontradas;
  }

  public async countOrders(filtro: FilterProps) {
    let totalQuery: FirebaseFirestore.Query = this.setup();

    if (filtro.ultimoMes) {
      const agora = new Date();

      const inicioDoMes = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        1,
        0,
        0,
        0,
        0
      ); 
      totalQuery = totalQuery.where("dataEncomenda", ">=", Timestamp.fromDate(inicioDoMes));
    }

    if (filtro.status) totalQuery = totalQuery.where("status", "==", filtro.status);

    const snapshot = await totalQuery.count().get()

    return snapshot.data().count
  }
}

export const orderService = new OrderService();