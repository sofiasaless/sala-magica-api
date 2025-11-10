// notificationService.ts
import { db } from "../config/firebase";
import { Notification, NotificationDestino, NotificationType } from "../types/notification.type";

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
        console.info('notificação criada para usuario:', doc.id)
        batch.set(notificacao_ref, notificacao_global);
      });
      await batch.commit();
    });
  }

  async createEncomendaNotificacao() {

  }
}

export const notificationService = new NotificationService();
