import { Router } from "express";
import { findDictionary } from "../controllers/dictionary.controller";

const router = Router();

router.get("/find", findDictionary);

export default router;
