import { DocumentReference } from "firebase-admin/firestore";

// export type Notification = {
//   id: string,
//   descricaoNot: string,
//   lido: boolean,
//   redirecionamento: string,
//   tipo: NotificationType,
//   tituloNot: string,
//   usuario_notificado: string | DocumentReference,
//   dataNotificacao: Date,
// }

// type NotificationType = "PADRAO" | "ENCOMENDA"

export type Notification = {
  id?: string;
  titulo: string;
  mensagem: string;
  tipo: NotificationType;
  destino: NotificationDestino; // quem deve receber
  referencia?: string; // link para o item relacionado (produto, encomenda etc.)
  doc_ref?: { // alguma referencia de documento para puxar e exibir na notificação
    ref: string,
    colecao: string
  }
  url?: string; // redirecionamento web
  lido: boolean;
  dataNotificacao: Date;
};

export type NotificationDestino =
  | { tipo: "USUARIO"; usuario_ref: DocumentReference }
  | { tipo: "ADMIN" };

export type NotificationType = "PRODUTO" | "ENCOMENDA" | "SISTEMA" | "ENCOMENDA_RESPOSTA";

export type NotificationRequestBody = Omit<
  Notification,
  "id" | "dataNotificacao" | "lido"
>