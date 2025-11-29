import { db } from "../config/firebase";
import { Favorite } from "../types/favorite.type";
import * as ProductService from "../services/products.service";
import { Product } from "../types/product.type";
import { COLLECTIONS, idToDocumentRef } from "../utils/firestore.util";
import { DocumentReference } from "firebase-admin/firestore";

const COLLECTION = "curtidas";

const setup = db.collection(COLLECTION);

function docToFavorite(id: string, data: FirebaseFirestore.DocumentData): Favorite {
  return {
    id_favorito: id,
    id_usuario: data.id_usuario?.id || '',
    id_produto: data.id_produto?.id || '',
    data_curtida: data.data_curtida && data.data_curtida.toDate ? data.data_curtida.toDate() : new Date(data.data_curtida),
  };
}

export const getAllFavorites = async (): Promise<Favorite[]> => {
  let query: FirebaseFirestore.Query = db.collection(COLLECTION)
  const snap = await query.orderBy("data_curtida", "desc").get();

  const favoritos: Favorite[] = snap.docs.map(doc => docToFavorite(doc.id, doc.data()));
  return favoritos
}

export const getFavoritesProductsByUserId = async (id_usuario: string): Promise<Product[]> => {
  let query: FirebaseFirestore.Query = db.collection(COLLECTION)
    .where("id_usuario", "==", idToDocumentRef(id_usuario, COLLECTIONS.usuarios));

  const snap = await query.orderBy("data_curtida", "desc").get();

  const favoritos: Favorite[] = snap.docs.map(doc => docToFavorite(doc.id, doc.data()));

  const produtos_encontrados: Promise<Product[]> = Promise.all(favoritos.map(fav =>
    ProductService.getProductById(fav.id_produto as string)
  ));

  return produtos_encontrados
}

export const createFavorite = async (id_usuario: string, id_produto: string): Promise<Favorite> => {
  if (id_usuario === undefined) throw new Error("id_usuario é obrigatório");
  if (id_produto === undefined) throw new Error("id_produto é obrigatório");

  const favoriteToSave: Favorite = {
    id_usuario: idToDocumentRef(id_usuario as string, COLLECTIONS.usuarios),
    id_produto: idToDocumentRef(id_produto as string, COLLECTIONS.produtos),
    data_curtida: new Date(),
  };

  const ref = await db.collection(COLLECTION).add(favoriteToSave);
  const doc = await ref.get();
  return docToFavorite(doc.id, doc.data()!);
}

export const deleteFavorite = async (id_usuario: string, id_produto: string): Promise<void> => {
  await db.collection(COLLECTION)
    .where("id_usuario", "==", idToDocumentRef(id_usuario as string, COLLECTIONS.usuarios))
    .where("id_produto", "==", idToDocumentRef(id_produto as string, COLLECTIONS.produtos))
    .get()
    .then(snapshot => {
      const batch = db.batch();
      snapshot.forEach(doc => batch.delete(doc.ref));
      return batch.commit();
    });
}

export const deleteFavoriteByFavId = async (id_favorite: string) => {
  await setup.doc(id_favorite).delete();
}

export const doFavoriteAction = async (id_usuario: string, id_produto: string) => {
  const favShareResult = await setup.where("id_usuario", "==", idToDocumentRef(id_usuario, COLLECTIONS.usuarios))
    .where("id_produto", "==", idToDocumentRef(id_produto, COLLECTIONS.produtos))
  .get();

  if (favShareResult.empty) {
    return await createFavorite(id_usuario, id_produto);
  }

  await deleteFavoriteByFavId(favShareResult.docs[0].id);
}