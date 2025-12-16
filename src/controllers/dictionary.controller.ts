import { Request, Response } from "express";
import { dictionaryService } from "../services/dictionary.service";

export const findDictionary = async (req: Request, res: Response) => {
  try {
    const result = await dictionaryService.findDictionary();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}