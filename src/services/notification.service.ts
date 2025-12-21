// notificationService.ts
import { db } from "../config/firebase";
import { Notification, NotificationDestino, NotificationRequestBody } from "../types/notification.type";
import { Order, ResponseOrderFields } from "../types/order.type";
import { COLLECTIONS, docToObject, idToDocumentRef } from "../utils/firestore.util";
import { PatternService } from "./pattern.service";

export interface NewOrderNotificationFields {
  order: Order,
  name_solicitante: string
}

export class NotificationService extends PatternService {

  constructor() {
    super(COLLECTIONS.notificacoes)
  }

  private async create(data: NotificationRequestBody, addDoc = true) {
    const doc: Notification = {
      ...data,
      dataNotificacao: new Date(),
      lido: false,
    }
    if (addDoc) await this.setup().add(doc);
    return doc
  }

  private async createGlobalNotificacao(notificacao: Notification) {
    db.collection("usuarios").get().then(async (snapshot) => {
      const batch = db.batch();
      snapshot.forEach((doc) => {
        const notificacao_ref = this.setup().doc();
        const notificacao_global: Notification = {
          ...notificacao,
          destino: { tipo: "USUARIO", usuario_ref: doc.ref },
          dataNotificacao: new Date(),
          lido: false,
        };
        // console.info('notificação criada para usuario:', doc.id)
        batch.set(notificacao_ref, notificacao_global);
      });
      await batch.commit();
    });
  }

  async createProdutoNotificacao(produtoId: string, nomeProduto: string) {
    const doc = await this.create({
      titulo: "Novo produto disponível na Sala Mágica!",
      mensagem: `Confira o novo produto "${nomeProduto}" agora na loja`,
      tipo: "PRODUTO",
      doc_ref: {
        colecao: COLLECTIONS.produtos,
        ref: produtoId
      },
      destino: {} as NotificationDestino, // destino será definido na função de criação global
    }, false);

    // mandando para a criação de notificação global
    await this.createGlobalNotificacao(doc);
  }

  async createEncomendaNotificacao(notBody: NewOrderNotificationFields) {
    await this.create({
      titulo: `Novo pedido de encomenda realizado por ${notBody.name_solicitante}!`,
      mensagem: `${notBody.order.descricao}`,
      tipo: "ENCOMENDA",
      destino: { tipo: "ADMIN" },
      referencia: `${notBody.order.imagemReferencia}`,
    }, true);
    console.info("notificação de nova encomenda criada")
  }

  async createRespostaEncomendaNotificacao(payload: ResponseOrderFields) {
    return await this.create({
      titulo: `Atualizações sobre sua encomenda de id #${payload.order.id}!`,
      mensagem: `${payload.response}`,
      tipo: "ENCOMENDA_RESPOSTA",
      destino: { tipo: "USUARIO", usuario_ref: idToDocumentRef(payload.order.solicitante as string, COLLECTIONS.usuarios) },
      doc_ref: {
        colecao: COLLECTIONS.encomendas,
        ref: payload.order.id as string
      }
    }, true);
  }

  public async findNotificationsByUserId(id_usuario: string, lidas: boolean = false): Promise<Notification[]> {
    let querySnapshot = await this.setup()
      .where("destino.tipo", "==", "USUARIO")
      .where("destino.usuario_ref", "==", idToDocumentRef(id_usuario, COLLECTIONS.usuarios))
      .orderBy("dataNotificacao", "desc")
    .get();

    if (lidas) querySnapshot.query.where("lido", "==", true)

    const notificacoes: Notification[] = querySnapshot.docs.map(doc => {
      return docToObject<Notification>(doc.id, {
        ...doc.data(),
        destino: {
          tipo: doc.data().destino.tipo,
          usuario_ref: doc.data().destino.usuario_ref.id || 'Não informado'
        },
        doc_ref: {
          ref: (doc.data().doc_ref?.ref === undefined)?null:doc.data().doc_ref.ref,
          colecao: (doc.data().doc_ref?.colecao === undefined)?null:doc.data().doc_ref.colecao
        }
      })
    });

    return notificacoes;
  }
}

export const notificationService = new NotificationService();
