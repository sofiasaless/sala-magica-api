// types/express/index.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      uid: string;
      email?: string;
      role?: "admin" | "user";
      [key: string]: any;
    };
  }
}
