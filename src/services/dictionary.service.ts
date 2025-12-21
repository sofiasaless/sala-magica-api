import { db } from "../config/firebase";
import { Dictionary, DictionaryItem } from "../types/dictionary.type";
import { COLLECTIONS, docToObject, idToDocumentRef } from "../utils/firestore.util";
import { PatternService } from "./pattern.service";

export class DictionaryService extends PatternService {

  constructor() {
    super(COLLECTIONS.dicionario)
  }

  private async gerarDicionario() {
    const produtos = await db.collection(COLLECTIONS.produtos).get()


    const itens: DictionaryItem[] = produtos.docs.map((prod) => {
      return {
        label: prod.data().titulo,
        productId: prod.id
      }
    })

    const dicionario: Dictionary = {
      dictionary_items: itens
    }

    this.setup().add(dicionario);
  }

  public async findDictionary() {
    const docDicionario = await this.setup().get();

    if (docDicionario.empty) throw Error("Dicionário não encontrado");

    const dicionario = docToObject<Dictionary>(docDicionario.docs[0].id, docDicionario.docs[0].data());
    return dicionario
  }

  public async updateItem(transaction: FirebaseFirestore.Transaction, item: DictionaryItem) {
    const dicti = await this.findDictionary();

    const itemIndex = dicti.dictionary_items.findIndex(it => it.productId === item.productId)
    dicti.dictionary_items[itemIndex] = {
      ...item
    }

    const dicRef = this.setup().doc(dicti.id!);
    transaction.update(dicRef, {
      dictionary_items: dicti.dictionary_items
    })
  }

  public async addItem(transaction: FirebaseFirestore.Transaction, item: DictionaryItem) {
    const dicti = await this.findDictionary();
    const dicRef = this.setup().doc(dicti.id!);

    transaction.update(dicRef, {
      dictionary_items: this.firestore_admin().firestore.FieldValue.arrayUnion(item)
    })
  }

  public async removeItem(transaction: FirebaseFirestore.Transaction, productId: string) {
    const dicti = await this.findDictionary();

    const updatedItems = dicti.dictionary_items.filter(it => it.productId !== productId)

    const dicRef = this.setup().doc(dicti.id!);
    transaction.update(dicRef, {
      dictionary_items: updatedItems
    })
  }

}

export const dictionaryService = new DictionaryService();