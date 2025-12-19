import { db } from "../config/firebase";
import { Dictionary, DictionaryItem } from "../types/dictionary.type";
import { COLLECTIONS, docToObject } from "../utils/firestore.util";
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
  
}

export const dictionaryService = new DictionaryService();