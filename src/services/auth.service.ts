import { CreateRequest, getAuth, UserRecord } from "firebase-admin/auth"
import { User } from "../types/user.type"
import { adminAuth } from "../config/firebase";

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
      console.info('usuario criado com sucesso: ', userRecord)
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
      const uid = decodedToken.uid;
      console.info('email do usuario do token ', decodedToken.email)
      return decodedToken.email
    })
    .catch((error) => {
      throw new Error(error)
    });
}