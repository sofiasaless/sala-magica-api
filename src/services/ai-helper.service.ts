import OpenAI from "openai";
import { SuggestionFields } from "../types/suggestion.type";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AiHelperService {

  private systemSuggestDescription: string

  constructor() {
    this.systemSuggestDescription = `Você é uma assistente criativa especializada em artesanato escolar infantil e decoração de jardins de infância. Seu objetivo é ajudar clientes a expressarem melhor suas ideias para encomendas personalizadas feitas à mão, usando uma linguagem clara. Nunca invente informações que o cliente não forneceu. Apenas organize, detalhe e torne a descrição mais compreensível para quem vai confeccionar a encomenda.`
  }

  public async suggestOrderDescription(payload: SuggestionFields) {
    const completion = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: "system",
          content: this.systemSuggestDescription
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

  private buildPromptForSuggestedOrderDescription(category: string, initialText: string): string {
    return `Categoria da encomenda: ${category}. Descrição inicial: "${initialText}" Reescreva a descrição acima de forma mais clara, mais detalhada, com sugestões lúdicas e bem organizada, mantendo a ideia original e um tom acolhedor e criativo. O texto deve ter no máximo 800 caracteres e estar pronto para ser colado diretamente no campo de descrição da encomenda, portanto NÃO use: listas, tópicos, títulos, e NÃO faça perguntas, explique o que está fazendo ou inclua observações adicionais.`
  }

}

export const aiHelperService = new AiHelperService();