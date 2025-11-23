import { Router } from "express";
import { createUser, testToken } from "../controllers/auth.controller";

const router = Router();

router.get("/test", testToken);
router.post("/create/user", createUser);

export default router;