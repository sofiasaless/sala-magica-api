// notificationService.ts
import { db } from "../config/firebase";
import { Notification, NotificationDestino, NotificationType, OrderAwnserNotificationPayload } from "../types/notification.type";
import { Order } from "../types/order.type";
import { COLLECTIONS, idToDocumentRef } from "../utils/firestore.util";

interface CreateNotificationDTO {
  titulo: string;
  mensagem: string;
  tipo: NotificationType;
  destino: NotificationDestino;
  referencia?: string;
  url?: string;
}

const COLLECTION = "notificacoes";

export class NotificationService {
  private collection = db.collection(COLLECTION);

  async create(data: CreateNotificationDTO, createDoc = true) {
    const doc: Notification = {
      ...data,
      dataNotificacao: new Date(),
      lido: false,
    }
    if (createDoc) await this.collection.add(doc);
    return doc
  }

  async createProdutoNotificacao(produtoId: string, nomeProduto: string) {
    const doc = await this.create({
      titulo: "Novo produto disponível!",
      mensagem: `Confira o novo produto "${nomeProduto}" agora na loja 🌸`,
      tipo: "PRODUTO",
      destino: {} as NotificationDestino, // destino será definido na função de criação global
      referencia: `/produtos/${produtoId}`,
      url: `https://sala-magica.vercel.app/produtos/${produtoId}`,
    }, false);

    // mandando para a criação de notificação global
    await this.createGlobalNotificacao(doc);
  }

  async createGlobalNotificacao(notificacao: Notification) {
    db.collection("usuarios").get().then(async (snapshot) => {
      const batch = db.batch();
      snapshot.forEach((doc) => {
        const notificacao_ref = db.collection(COLLECTION).doc();
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

  async createEncomendaNotificacao(order: Order) {
    await this.create({
      titulo: `Novo pedido de encomenda realizado por (nome do usuario)!`,
      mensagem: `${order.descricao}`,
      tipo: "ENCOMENDA",
      destino: { tipo: "ADMIN" },
      referencia: `${order.imagemReferencia}`,
      url: `https://sala-magica.vercel.app/encomendas/${order.id}`,
    }, true);
    console.info("notificação de nova encomenda criada")
  }

  async createRespostaEncomendaNotificacao(payload: OrderAwnserNotificationPayload) {
    // validações para campos vazios
    if (payload.id_encomenda == undefined || payload.id_usuario == undefined || payload.mensagem == undefined) {
      throw new Error("Campos obrigatórios ausentes na notificação de resposta de encomenda");
    }

    await this.create({
      titulo: `Sua encomenda foi atualizada!`,
      mensagem: `
      Acompanhe o status da sua encomenda #${payload.id_encomenda} \n
      Resposta: ${payload.mensagem}\n
      Obrigado por escolher a Sala Mágica!
      `,
      tipo: "ENCOMENDA",
      destino: { tipo: "USUARIO", usuario_ref: idToDocumentRef(payload.id_usuario as string, COLLECTIONS.usuarios) },
      referencia: `${payload.id_encomenda}`,
      url: `https://sala-magica.vercel.app/encomendas/${payload.id_encomenda}`,
    }, true);
  }

  async getNotificationsByUserId(id_usuario: string, lidas: boolean = false): Promise<Notification[]> {
    let querySnapshot = await db
      .collection(COLLECTION)
      .where("destino.tipo", "==", "USUARIO")
      .where("destino.usuario_ref", "==", idToDocumentRef(id_usuario, COLLECTIONS.usuarios))
      .orderBy("dataNotificacao", "desc")
    .get();

    if (lidas) querySnapshot.query.where("lido", "==", true)

    const notificacoes: Notification[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data() as Notification,
    }));
    return notificacoes;
  }
}

export const notificationService = new NotificationService();
