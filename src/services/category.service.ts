import { deleteCategory } from "../controllers/category.controller";
import { Category } from "../types/categoria.type";
import { COLLECTIONS, docToObject } from "../utils/firestore.util";
import { PatternService } from "./pattern.service";

export class CategoryService extends PatternService {

  constructor() {
    super(COLLECTIONS.categorias);
  }

  public async createCategory(body: Partial<Category>) {
    if (body.nome === undefined || body.nome === '') throw new Error("Nome é obrigatório para criar categoria");

    const toSave: Omit<Category, "id"> = {
      nome: body.nome,
      data_criacao: new Date
    }

    const ref = await this.setup().add(toSave);
    const doc = await ref.get()

    return docToObject<Category>(doc.id, doc.data()!);
  }

  public async findAllCategories(): Promise<Category[]> {
    const docs = (await this.setup().get()).docs

    const list = docs.map((doc) => {
      return docToObject<Category>(doc.id, doc.data()!)
    })

    return list;
  }

  public async updateCategory(id_category: string, nome: string) {
    const ref = this.setup().doc(id_category);
    await ref.update({
      nome: nome
    })
  }

  public async deleteCategory(id_category: string) {
    const ref = this.setup().doc(id_category);
    await ref.delete();
  }
}

export const categoryService = new CategoryService();