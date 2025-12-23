import { Favorite } from "../types/favorite.type";
import { Product } from "../types/product.type";
import { COLLECTIONS, docToObject, idToDocumentRef } from "../utils/firestore.util";
import { PatternService } from "./pattern.service";
import { productService } from "./products.service";

class FavoriteService extends PatternService {
  constructor() {
    super(COLLECTIONS.curtidas)
  }

  public async getAllFavorites(): Promise<Favorite[]> {
    let query: FirebaseFirestore.Query = this.setup()
    const snap = await query.orderBy("data_curtida", "desc").get();

    const favoritos: Favorite[] = snap.docs.map(doc => docToObject(doc.id, doc.data()));
    return favoritos
  }

  public async getFavoritesProductsByUserId(id_usuario: string): Promise<Product[]> {
    let query: FirebaseFirestore.Query = this.setup()
      .where("id_usuario", "==", idToDocumentRef(id_usuario, COLLECTIONS.usuarios));

    const snap = await query.orderBy("data_curtida", "desc").get();

    const favoritos: Favorite[] = snap.docs.map(doc => docToObject(doc.id, doc.data()));

    const produtos_encontrados: Promise<Product[]> = Promise.all(favoritos.map(fav =>
      productService.getProductById(fav.id_produto as string)
    ));

    return produtos_encontrados
  }

  public async createFavorite(id_usuario: string, id_produto: string): Promise<Favorite> {
    if (id_usuario === undefined) throw new Error("id_usuario é obrigatório");
    if (id_produto === undefined) throw new Error("id_produto é obrigatório");

    const favoriteToSave: Favorite = {
      id_usuario: idToDocumentRef(id_usuario as string, COLLECTIONS.usuarios),
      id_produto: idToDocumentRef(id_produto as string, COLLECTIONS.produtos),
      data_curtida: new Date(),
    };

    const ref = await this.setup().add(favoriteToSave);
    const doc = await ref.get();
    return docToObject<Favorite>(doc.id, doc.data()!);
  }

  public async deleteFavorite(id_usuario: string, id_produto: string): Promise<void> {
    await this.setup()
      .where("id_usuario", "==", idToDocumentRef(id_usuario as string, COLLECTIONS.usuarios))
      .where("id_produto", "==", idToDocumentRef(id_produto as string, COLLECTIONS.produtos))
      .get()
      .then(snapshot => {
        const batch = this.firestore_db().batch();
        snapshot.forEach(doc => batch.delete(doc.ref));
        return batch.commit();
      });
  }

  public async deleteFavoriteByFavId(id_favorite: string) {
    await this.setup().doc(id_favorite).delete();
  }

  public async doFavoriteAction (id_usuario: string, id_produto: string) {
    const favShareResult = await this.setup().where("id_usuario", "==", idToDocumentRef(id_usuario, COLLECTIONS.usuarios))
      .where("id_produto", "==", idToDocumentRef(id_produto, COLLECTIONS.produtos))
      .get();

    if (favShareResult.empty) {
      return await this.createFavorite(id_usuario, id_produto);
    }

    await this.deleteFavoriteByFavId(favShareResult.docs[0].id);
  }

  public async deleteFavoriteInTransactionByProductId(transaction: FirebaseFirestore.Transaction, product_id: string) {
    const snap = await this.setup().where("id_produto", "==", idToDocumentRef(product_id, COLLECTIONS.produtos)).get()

    snap.docs.map((doc) => {
      transaction.delete(doc.ref);
    })

  }

  public async deleteFavoriteInTransactionByUserUid(transaction: FirebaseFirestore.Transaction, uid_ser: string) {
    const snap = await this.setup().where("id_usuario", "==", idToDocumentRef(uid_ser, COLLECTIONS.usuarios)).get()

    snap.docs.map((doc) => {
      transaction.delete(doc.ref);
    })

  }

}

export const favoriteService = new FavoriteService();