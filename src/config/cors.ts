import cors from "cors";

const allowedOrigins = [
  "https://sala-magica-client.vercel.app",
  "http://localhost:5173",
];

export const corsConfig = cors({
  origin: (origin, callback) => {
    // permitir ferramentas como Postman ou curl
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
});
