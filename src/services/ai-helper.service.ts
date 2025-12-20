import OpenAI from "openai";
import { SuggestionOrderDescriptionFields, SuggestionOrderResponseFields } from "../types/suggestion.type";
import { systemPromptOrderDescription, systemPromptOrderResponse } from "../constants/ai-helper-systemPrompts.constant";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AiHelperService {

  private systemSuggestOrderDescription: string
  private systemSuggestOrderResponse: string

  constructor() {
    this.systemSuggestOrderDescription = systemPromptOrderDescription,
      this.systemSuggestOrderResponse = systemPromptOrderResponse
  }

  public async suggestOrderDescription(payload: SuggestionOrderDescriptionFields) {
    const completion = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: "system",
          content: this.systemSuggestOrderDescription
        },
        {
          role: "user",
          content: this.buildPromptForSuggestedOrderDescription(payload.categoria, payload.descricaoInicial)
        },
      ],
      store: true
    })

    return completion.choices[0].message.content
  }

  public async suggestOrderResponse(payload: SuggestionOrderResponseFields) {
    const completion = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: "system",
          content: this.systemSuggestOrderResponse
        },
        {
          role: "user",
          content: this.buildPromptForSuggestOrderResponse(payload)
        },
      ],
      store: true
    })

    return completion.choices[0].message.content
  }

  private buildPromptForSuggestedOrderDescription(category: string, initialText: string): string {
    return `Categoria da encomenda: ${category}. Descrição inicial: "${initialText}" Reescreva a descrição acima de forma mais clara, mais detalhada, com sugestões lúdicas e bem organizada, mantendo a ideia original e um tom acolhedor e criativo. O texto deve ter no máximo 800 caracteres e estar pronto para ser colado diretamente no campo de descrição da encomenda, portanto NÃO use: listas, tópicos, títulos, e NÃO faça perguntas, explique o que está fazendo ou inclua observações adicionais.`
  }

  private buildPromptForSuggestOrderResponse(fields: SuggestionOrderResponseFields) {
    return `Dados da encomenda: 
    Nome do cliente: ${fields.cliente_nome} 
    Status da encomenda: ${fields.status_encomenda} 
    Categoria: ${fields.categoria}
    Descrição da encomenda: "${fields.descricao_encomenda}"`
  }

}

export const aiHelperService = new AiHelperService();