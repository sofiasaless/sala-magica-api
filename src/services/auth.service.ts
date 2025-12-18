import { CreateRequest, getAuth, UserRecord } from "firebase-admin/auth";
import { adminAuth } from "../config/firebase";
import { User, UserFirestoreDoc } from "../types/user.type";
import { COLLECTIONS } from "../utils/firestore.util";
import { PatternService } from "./pattern.service";

class AuthService extends PatternService {
  constructor() {
    super(COLLECTIONS.usuarios);
  }

  public async createNewUser(user: CreateRequest, role: "admin" | "user") {
    if (user.email === undefined || user.email === '') throw new Error("Necessário preencher e-mail")
    if (user.password === undefined || user.password === '') throw new Error("Necessário preencher senha")

    return await getAuth().createUser({
      ...user,
      disabled: false,
      emailVerified: false
    })
      .then(async (userRecord) => {
        // definr role padrão
        await this.setUserRole(userRecord.uid, role)

        // salvando o usuario criado no firestore
        const usuarioFirestore: UserFirestoreDoc = {
          email: (userRecord.email === undefined) ? '' : userRecord.email,
          foto_perfil: (userRecord.photoURL === undefined) ? '' : userRecord.photoURL,
          nome: (userRecord.displayName === undefined) ? '' : userRecord.displayName,
          telefone: (userRecord.phoneNumber === undefined) ? '' : userRecord.phoneNumber,
          data_criacao: new Date()
        }
        const usuRef = this.setup().doc(userRecord.uid)
        await usuRef.set(usuarioFirestore);

        return this.userRecordToUserType(userRecord)
      })
      .catch((error) => {
        throw new Error(error)
      });

  }

  public async verifyIdToken(token: string) {
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

  private userRecordToUserType(userToConvert: UserRecord) {
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

  private async setUserRole(uid: string, role: "admin" | "user") {
    await adminAuth.setCustomUserClaims(uid, { role });
    console.info('role definida com sucesso para usuario ', uid)
    return { success: true };
  }

}

export const authService = new AuthService();