import { getAuth } from "firebase-admin/auth";
import { User } from "../types/user.type";
import { COLLECTIONS, docToObject } from "../utils/firestore.util";
import { PatternService } from "./pattern.service";
import { orderService } from "./order.service";
import { cartService } from "./cart.service";
import { favoriteService } from "./favorite.service";

class UserService extends PatternService {
  private favService = favoriteService;
  private crtService = cartService;
  private ordrService = orderService;

  constructor() {
    super(COLLECTIONS.usuarios);
  }

  public async findById(id: string) {
    const snap = await this.setup().doc(id).get()

    if (!snap.exists) throw new Error("Usuário  não encontrado por id")

    return docToObject<User>(snap.id, snap.data()!);
  }

  public async countUsers() {
    const total = await this.setup().count().get()
    return {
      total: total.data().count
    }
  }


  public async updateUser(uid: string, userBody: Partial<User>) {
    // atualizando o auth
    await getAuth().updateUser(uid, {
      ...userBody
    })

    // atualizando no firestore
    await this.setup().doc(uid).update({
      nome: userBody.displayName,
      telefone: userBody.phoneNumber
    });
  }

  public async deleteUser(uid: string) {
    if (!this.ordrService) {
      this.setOrderService();
    }

    await this.firestore_db().runTransaction(async (transaction) => {

      // apagando todos os registros que o usuário deixou no banco
      await this.crtService.removeInTransactionByUserUid(transaction, uid);
      await this.ordrService.deleteInTransaction(transaction, uid);
      await this.favService.deleteFavoriteInTransactionByUserUid(transaction, uid);

      transaction.delete(this.setup().doc(uid))
    })

    // apagando do auth
    await getAuth().deleteUser(uid);
  }

  private setOrderService() {
    this.ordrService = orderService;
  }


}

export const userService = new UserService();