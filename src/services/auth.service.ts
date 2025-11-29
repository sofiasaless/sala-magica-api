import { CreateRequest, getAuth, UserRecord } from "firebase-admin/auth"
import { User, UserFirestoreDoc } from "../types/user.type"
import { adminAuth, db } from "../config/firebase";
import { COLLECTIONS } from "../utils/firestore.util";

const COLLECTION = COLLECTIONS.usuarios;

function userRecordToUserType(userToConvert: UserRecord) {
  const userConverted: User = {
    uid: userToConvert.uid,
    disabled: userToConvert.disabled,
    displayName: userToConvert.displayName || '',
    email: userToConvert.email || '',
    emailVerified: userToConvert.emailVerified,
    phoneNumber: userToConvert.phoneNumber || '',
    photoURL: userToConvert.photoURL || '',
    password: userToConvert.passwordHash || '',
  }

  return userConverted
}

export async function setUserRole(uid: string, role: "admin" | "user") {
  await adminAuth.setCustomUserClaims(uid, { role });
  console.info('role definida com sucesso para usuario ', uid)
  return { success: true };
}

export const createNewUser = async (user: CreateRequest) => {
  if (user.email === undefined || user.email === '') throw new Error("Necessário preencher e-mail")
  if (user.password === undefined || user.password === '') throw new Error("Necessário preencher senha")

  return await getAuth().createUser({
    ...user,
    disabled: false,
    emailVerified: false
  })
    .then(async (userRecord) => {
      // definr role padrão
      await setUserRole(userRecord.uid, "user")
      
      // salvando o usuario criado no firestore
      const usuarioFirestore: UserFirestoreDoc = {
        email: (userRecord.email === undefined)?'':userRecord.email,
        foto_perfil: (userRecord.photoURL === undefined)?'':userRecord.photoURL,
        nome: (userRecord.displayName === undefined)?'':userRecord.displayName,
        telefone: (userRecord.phoneNumber === undefined)?'':userRecord.phoneNumber,
        data_criacao: new Date()
      }
      const usuRef = db.collection(COLLECTION).doc(userRecord.uid)
      await usuRef.set(usuarioFirestore);

      return userRecordToUserType(userRecord)
    })
    .catch((error) => {
      throw new Error(error)
    });

}

export const verifyIdToken = async (token: string) => {
  return await getAuth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      console.info('email do usuario do token ', decodedToken.email)
      return decodedToken.email
    })
    .catch((error) => {
      throw new Error(error)
    });
}