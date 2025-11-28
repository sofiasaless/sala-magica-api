export type User = {
  uid?: string,
  email: string,
  emailVerified: boolean,
  phoneNumber: string,
  password: string,
  displayName: string,
  photoURL: string,
  disabled: boolean
}

export type UserFirestoreDoc = {
  nome?: string,
  email?: string,
  foto_perfil?: string,
  telefone?: string,
  data_criacao: Date
}