import express from "express";
import cors from "cors";
import productRoutes from "./controllers/products.controller";
import orderRouter from "./controllers/orders.controller"
import favoriteRouter from "./controllers/favorite.controller"
import notificationRouter from "./controllers/notification.controller"
import authRouter from "./controllers/auth.controller"
import categoryRouter from "./controllers/category.controller"
import dictionaryRouter from "./controllers/dictionary.controller"
import cartRouter from "./controllers/cart.controller"
import aiHelperRouter from "./controllers/aihelper.controller"
import { corsConfig } from "./config/cors";

const app = express();

// app.use(cors());
app.use(corsConfig);
app.use(express.json());

// rotas
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/dictionary", dictionaryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/ai-helper", aiHelperRouter);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

export default app;
