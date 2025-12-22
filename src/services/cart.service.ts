import admin from "firebase-admin";
import { ItemCart } from "../types/cart.type";
import { COLLECTIONS, docToObject, idToDocumentRef } from "../utils/firestore.util";
import { PatternService } from "./pattern.service";

class CartService extends PatternService {
  
  constructor() {
    super(COLLECTIONS.carrinho);
  }

  public async findCartItems(userId: string) {
    const queryItemCart = await this.setup().where("usuario_ref", "==", idToDocumentRef(userId, COLLECTIONS.usuarios)).get();

    if (queryItemCart.empty) return []

    const items = queryItemCart.docs.map((item) => {
      return docToObject<ItemCart>(item.id, item.data())
    })

    return items
  }

  public async doCartAction(userId: string, idProduto: string, quantidade: number) {
    const prodRef = idToDocumentRef(idProduto, COLLECTIONS.produtos);
    const usuRef = idToDocumentRef(userId, COLLECTIONS.usuarios)

    const queryItemCart = this.setup().where("usuario_ref", "==", usuRef).where("produto_ref", "==", prodRef);

    const snap = await queryItemCart.get()

    // se estiver vazio, então adiciona como item no carrinho do usuario
    if (snap.empty) {
      const itemCart: ItemCart = {
        quantidade: quantidade,
        produto_ref: prodRef,
        usuario_ref: usuRef,
        data_adicao: new Date
      }

      await this.setup().add(itemCart);
      return
    }

    // se nao estiver vazio, quer dizer que ele clicou em adicionar novamente e deve ser incrementado na quantidade
    const itemCartRef = snap.docs[0].ref

    await itemCartRef.update({
      quantidade: admin.firestore.FieldValue.increment(quantidade)
    })
  }

  public async updateQuantity(id_item: string, quantidade: number) {
    const query = this.setup().doc(id_item);

    const snap = await query.get();
    if (!snap.exists) throw new Error("Item não foi encontrado no carrinho");

    await snap.ref.update({
      quantidade: quantidade
    })

  }

  public async remove(id_item: string) {
    await this.setup().doc(id_item).delete();
  }

  public async removeAll(userId: string) {
    const snap = await this.setup().where("usuario_ref", "==", idToDocumentRef(userId, COLLECTIONS.usuarios)).get();

    snap.forEach(async (doc) => {
      await doc.ref.delete()
    })

  }

  public async removeInTransaction(transaction: FirebaseFirestore.Transaction, id_produto: string) {
    const snap = await this.setup().where("produto_ref", "==", idToDocumentRef(id_produto, COLLECTIONS.produtos)).get();
  
    snap.docs.map((doc) => {
      transaction.delete(doc.ref);
    })
  }

}

export const cartService = new CartService();