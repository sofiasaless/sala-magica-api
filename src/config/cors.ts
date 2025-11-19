import cors from "cors";

const allowedOrigins = [
  "*",
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
