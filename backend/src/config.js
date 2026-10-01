import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173"
};
