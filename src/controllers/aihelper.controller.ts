import { Request, Response, Router } from "express";
import { aiHelperService } from "../services/ai-helper.service";
import { SuggestionFields } from "../types/suggestion.type";
import { authMiddleware } from "../auth/authMiddleware";

const router = Router()

async function suggestOrderDescription(req: Request, res: Response) {
  try {
    const body = req.body as SuggestionFields
    const resposta = await aiHelperService.suggestOrderDescription(body);
    res.status(200).json({ sugestao: resposta })
  } catch (error: any) {
    console.error(error)
    res.sendStatus(400).json({ message: error.message })
  }
}
router.post("/suggest-description", authMiddleware('user'), suggestOrderDescription);


export default router