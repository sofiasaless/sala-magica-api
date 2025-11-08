import { db } from "../config/firebase";
import { Favorite } from "../types/favorite.type";
import { COLLECTIONS, idToDocumentRef } from "../utils/firestore.util";

const COLLECTION = "curtidas";

function docToFavorite(id: string, data: FirebaseFirestore.DocumentData): Favorite {
  return {
    id_favorito: id,
    id_usuario: data.id_usuario,
    id_produto: data.id_produto,
    data_curtida: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
  };
}

export const getAllFavorites = async (): Promise<Favorite[]> => {
  let query: FirebaseFirestore.Query = db.collection(COLLECTION)
  const snap = await query.orderBy("data_curtida", "desc").get();

  const favoritos: Favorite[] = snap.docs.map(doc => docToFavorite(doc.id, doc.data()));
  return favoritos
}

export const getFavoritesByUserId = async (id_usuario: string): Promise<Favorite[]> => {
  let query: FirebaseFirestore.Query = db.collection(COLLECTION)
    .where("id_usuario", "==", idToDocumentRef(id_usuario, COLLECTIONS.usuarios));
    
  const snap = await query.orderBy("data_curtida", "desc").get();

  const favoritos: Favorite[] = snap.docs.map(doc => docToFavorite(doc.id, doc.data()));
  return favoritos
}

export const createFavorite = async (payload: Omit<Favorite, "id_favorito" | "data_curtida">): Promise<Favorite> => {
  if (payload.id_usuario === undefined) throw new Error("id_usuario é obrigatório");
  if (payload.id_produto === undefined) throw new Error("id_produto é obrigatório");

  const dataToSave: Favorite = {
    id_usuario: idToDocumentRef(payload.id_usuario as string, COLLECTIONS.usuarios),
    id_produto: idToDocumentRef(payload.id_produto as string, COLLECTIONS.produtos),
    data_curtida: new Date(),
  };

  const ref = await db.collection(COLLECTION).add(dataToSave);
  const doc = await ref.get();
  return docToFavorite(doc.id, doc.data()!);
}

export const deleteFavorite = async (payload: Favorite): Promise<void> => {
  await db.collection(COLLECTION)
  .where("usuarioRef", "==", idToDocumentRef(payload.id_usuario as string, COLLECTIONS.usuarios))
  .where("produtoRef", "==", idToDocumentRef(payload.id_produto as string, COLLECTIONS.produtos))
  .get()
  .then(snapshot => {
    const batch = db.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    return batch.commit();
  });
}