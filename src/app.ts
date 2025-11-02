import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.router";

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/api/products", productRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

export default app;
