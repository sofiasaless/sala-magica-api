import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.router";
import orderRouter from "./routes/order.router"
import favoriteRouter from "./routes/favorite.router"
import notificationRouter from "./routes/notification.router"
import authRouter from "./routes/auth.router"
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

// health
app.get("/health", (req, res) => res.json({ ok: true }));

export default app;
