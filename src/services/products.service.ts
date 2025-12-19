import { Product } from "../types/product.type";
import { COLLECTIONS, idToDocumentRef } from "../utils/firestore.util";
import { eventBus, eventNames } from "./eventBus";
import { PatternService } from "./pattern.service";

interface FilterProps {
  categoria?: string,
  ativo?: boolean
}

class ProductService extends PatternService {
  constructor() {
    super(COLLECTIONS.produtos)
  }

  /**
   * Converte documento Firestore para Produto (inclui id e converte Timestamp -> Date)
   */
  private docToProduto(id: string, data: FirebaseFirestore.DocumentData): Product {
    return {
      id,
      titulo: data.titulo,
      descricao: data.descricao,
      preco: data.preco,
      modelagem: data.modelagem,
      categoria: data.categoria,
      altura: data.altura,
      comprimento: data.comprimento,
      categoria_reference: data.categoria_reference.id || '',
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
  public async createProduct (payload: Partial<Product>) {
    // preencher defaults mínimos
    const toCreate: Omit<Product, "id"> = {
      titulo: payload.titulo || "",
      descricao: payload.descricao || "",
      preco: payload.preco ?? 0,
      modelagem: payload.modelagem || "",
      categoria: payload.categoria || "",
      categoria_reference: idToDocumentRef(payload.categoria_reference as string, COLLECTIONS.categorias),
      altura: payload.altura || 0,
      comprimento: payload.comprimento || 0,
      imagemCapa: payload.imagemCapa || "",
      imagens: payload.imagens || [],
      ativo: payload.ativo ?? true,
      dataAnuncio: new Date(),
    };

    // validações básicas (pode melhorar com zod/joi)
    if (!toCreate.titulo || toCreate.titulo === '') throw new Error("Campo título é obrigatório");
    if (toCreate.preco === undefined || toCreate.preco === null) throw new Error("Campo preço é obrigatório");

    const ref = await this.setup().add(toCreate);
    const doc = await ref.get();
    const produto = this.docToProduto(doc.id, doc.data()!);

    // emitindo o evento de produto criado para a notificação
    await eventBus.emit(eventNames.PRODUTO_CRIADO, produto);

    return produto;
  };

  /**
   * atualiza campos de um documento da coleção produto
   * @param payload
   * @param id_produto
  */
  public async updateProduct (id_produto: string, payload: Partial<Product>): Promise<void> {
    const produtoRef = this.setup().doc(id_produto);
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

    // se houver atualização da categoria, deve ser feita por último por se tratar de um reference
    if (payload.categoria_reference) {
      await produtoRef.update({
        categoria_reference: idToDocumentRef(payload.categoria_reference as string, COLLECTIONS.categorias)
      });
    }
  }


  /**
   * lista todos os produtos
   * - aceita Product onde dataAnuncio é Date ou string ISO; armazenamos como Timestamp
   */
  public async listProducts (): Promise<Product[]> {
    let query: FirebaseFirestore.Query = this.setup();
    const snap = await query.orderBy("dataAnuncio", "desc").get();

    const items: Product[] = snap.docs.map(doc => this.docToProduto(doc.id, doc.data()));
    return items;
  };

  public async getProductById (product_id: string): Promise<Product> {
    const doc = await this.setup().doc(product_id).get();
    if (!doc.exists) throw new Error("Produto não encontrado por id");
    return this.docToProduto(doc.id, doc.data()!);
  }

  /**
   * lista os produtos de forma paginada
   * @param limit 
   * @param startAfterId 
   * @returns 
  */
  public async pageProducts ({
    limit,
    categoria,
    ordem,
    cursor,
    cursorPrev
  }: {
    limit: number;
    categoria?: string;
    ordem?: string;
    cursor?: string;      // próximo
    cursorPrev?: string;  // anterior
  }) {
    let query = this.setup().orderBy(ordem ?? "dataAnuncio", "desc");

    if (categoria) query = query.where("categoria_reference", "==", idToDocumentRef(categoria, COLLECTIONS.categorias));

    let snapshot;

    // Indo para a próxima página
    if (cursor) {
      const cursorDoc = await this.setup().doc(cursor).get();
      snapshot = await query.startAfter(cursorDoc).limit(limit).get();
    }
    // Voltando para a página anterior
    else if (cursorPrev) {
      const cursorDoc = await this.setup().doc(cursorPrev).get();
      snapshot = await query.endBefore(cursorDoc).limitToLast(limit).get();
    }
    // Primeira página
    else {
      snapshot = await query.limit(limit).get();
    }

    const produtos = snapshot.docs.map(doc => {
      return this.docToProduto(doc.id, doc.data()!)
    });

    const first = snapshot.docs[0];
    const last = snapshot.docs[snapshot.docs.length - 1];

    return {
      produtos,
      nextCursor: last?.id ?? null,
      prevCursor: first?.id ?? null,
    };
  };

  /**
   * exclui o produto da coleção
   * @param product_id 
   */
  public async deleteProduct (product_id: string) {
    // posteriormente vai ser necessário excluir outros documentos que terão vinculos com o produto (curtidas, carrinho, etc)

    // por enquanto excluindo apenas o produto
    await this.setup().doc(product_id).delete();
  }

  public async countProducts (filtro: FilterProps) {
    let totalQuery: FirebaseFirestore.Query = this.setup();

    if (filtro.categoria) totalQuery = totalQuery.where("categoria_reference", "==", idToDocumentRef(filtro.categoria, COLLECTIONS.categorias));

    if (filtro.ativo) totalQuery = totalQuery.where("ativo", "==", filtro.ativo);

    const snapshot = await totalQuery.count().get()

    return snapshot.data().count
  }
}

export const productService = new ProductService();