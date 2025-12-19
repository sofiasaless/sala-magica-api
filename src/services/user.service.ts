import { User } from "../types/user.type";
import { COLLECTIONS, docToObject } from "../utils/firestore.util";
import { PatternService } from "./pattern.service";

class UserService extends PatternService {
  constructor() {
    super(COLLECTIONS.usuarios)
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
}

export const userService = new UserService();