import admin from "firebase-admin";
import { db } from "../config/firebase";
import { Product, ProductUpdateRequestBody } from "../types/product.type";

const COLLECTION = "produtos";

/**
 * Converte documento Firestore para Produto (inclui id e converte Timestamp -> Date)
 */
function docToProduto(id: string, data: FirebaseFirestore.DocumentData): Product {
  return {
    id,
    titulo: data.titulo,
    descricao: data.descricao,
    preco: data.preco,
    modelagem: data.modelagem,
    categoria: data.categoria,
    altura: data.altura,
    comprimento: data.comprimento,
    imagemCapa: data.imagemCapa,
    imagens: data.imagens || [],
    ativo: data.ativo === undefined ? true : data.ativo,
    dataAnuncio: data.dataAnuncio && data.dataAnuncio.toDate ? data.dataAnuncio.toDate() : new Date(data.dataAnuncio),
  };
}

/**
 * cria produto
 * - aceita Product onde dataAnuncio é Date ou string ISO; armazenamos como Timestamp
 */
export const createProduct = async (payload: Omit<Product, "id">): Promise<Product> => {
  // validações básicas (pode melhorar com zod/joi)
  if (!payload.titulo) throw new Error("titulo é obrigatório");
  if (payload.preco === undefined || payload.preco === null) throw new Error("preco é obrigatório");
  if (!payload.dataAnuncio) payload.dataAnuncio = new Date();

  // converter dataAnuncio para Timestamp do Firestore
  const dataToSave = {
    ...payload,
    dataAnuncio: admin.firestore.Timestamp.fromDate(new Date(payload.dataAnuncio)),
  };

  const ref = await db.collection(COLLECTION).add(dataToSave);
  const doc = await ref.get();
  return docToProduto(doc.id, doc.data()!);
};

/**
 * atualiza campos de um documento da coleção produto
 * @param payload
 * @param id_produto
*/
export const updateProduct = async (id_produto: string, payload: Partial<Product>): Promise<void> => {
  const produtoRef = db.collection(COLLECTION).doc(id_produto);
  const produtoDoc = await produtoRef.get();
  
  if (!produtoDoc.exists) throw new Error("Produto não encontrado");
  
  // assegurando que determinados campos nao sejam atualizados mesmo que sejam enviados no payload
  const camposNaoPermitidos = ["id", "dataAnuncio"];
  for (const campo of camposNaoPermitidos) {
    if (campo in payload) delete (payload as any)[campo];
  }
  
  await produtoRef.update({
    ...payload
  });  
}


/**
 * lista todos os produtos
 * - aceita Product onde dataAnuncio é Date ou string ISO; armazenamos como Timestamp
 */
export const listProducts = async (): Promise<Product[]> => {
  let query: FirebaseFirestore.Query = db.collection(COLLECTION);
  const snap = await query.orderBy("dataAnuncio", "desc").get();

  const items: Product[] = snap.docs.map(doc => docToProduto(doc.id, doc.data()));
  
  /* também funciona
  const cityRef = db.collection(COLLECTION)
  const docs = (await cityRef.get()).docs;
  const items: Product[] = docs.map(doc => docToProduto(doc.id, doc.data()));
   */
  return items;
};

export const getProductById = async (product_id: string): Promise<Product> => {
  const doc = await db.collection(COLLECTION).doc(product_id).get();
  if (!doc.exists) throw new Error("Produto não encontrado");
  return docToProduto(doc.id, doc.data()!);
}

/**
 * lista os produtos de forma paginada
 * @param limit 
 * @param startAfterId 
 * @returns 
*/
export const pageProducts = async (
  limit: number,
  startAfterId?: string
) => {
  let query = db.collection(COLLECTION).orderBy("dataAnuncio", "desc").limit(limit);

  // se o cliente mandou o último ID da página anterior, usa startAfter, quer dizer que ele paginou para a próxima página
  if (startAfterId) {
    const lastDoc = await db.collection(COLLECTION).doc(startAfterId).get();
    if (lastDoc.exists) {
      query = query.startAfter(lastDoc);
    }
  }

  const snapshot = await query.get();

  // mapeia para objetos Produto
  const produtos: Product[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Product),
  }));

  // captura o último documento retornado (para o front usar na próxima página)
  const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;

  return {
    produtos,
    lastVisible,
    total: snapshot.size,
  };
};

/**
 * exclui o produto da coleção
 * @param product_id 
 */
export const deleteProduct = async (product_id: string) => {
  // posteriormente vai ser necessário excluir outros documentos que terão vinculos com o produto (curtidas, carrinho, etc)

  // por enquanto excluindo apenas o produto
  await db.collection(COLLECTION).doc(product_id).delete();
}