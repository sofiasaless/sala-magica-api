import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.router";
import orderRouter from "./routes/order.router"

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRouter);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

export default app;
