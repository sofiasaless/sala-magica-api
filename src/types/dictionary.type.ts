export type DictionaryItem = {
  productId: string,
  label: string,
}

export type Dictionary = {
  id?: string;
  dictionary_items: DictionaryItem[];
}