import { DocumentReference, Timestamp } from "firebase-admin/firestore"

export type Order = {
  id?: string,
  categoria_reference: string | DocumentReference,
  altura?: number,
  comprimento?: number,
  descricao: string,
  pendente: boolean,
  imagemReferencia?: string[],
  referencias?: string,
  solicitante: string | DocumentReference,
  respostas?: OrderResponses[],
  status: OrderStatus,
  dataEncomenda: Date
}

export type OrderStatus = 'NOVA' | 'EM ANÁLISE' | 'EM PRODUÇÃO' | 'CANCELADO' | 'FINALIZADO'

export type OrderResponses = {
  mensagem: string,
  data: Date
}

export type ResponseOrderFields = {
  order: Pick<Order, "id" | "solicitante">,
  response: string
}

export const transformOrderResponses = (respostas: OrderResponses[]) => {
  if (respostas === undefined) return []
  const values = respostas.map((rep) => {
    return {
      mensagem: rep.mensagem,
      data: (rep.data as unknown as Timestamp).toDate()
    }
  })
  return values
}