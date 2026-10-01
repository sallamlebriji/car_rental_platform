import { Router } from "express";
import { z } from "zod";
import { changeMyPassword, login, logout, me, register } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";

const router = Router();

router.post(
  "/register",
  validate(
    z.object({
      body: z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        agencyId: z.string().min(1),
        phone: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        cinOrPassport: z.string().optional(),
        driverLicense: z.string().optional()
      }),
      query: z.object({}).optional(),
      params: z.object({}).optional()
    })
  ),
  register
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.post("/change-password", authenticate, changeMyPassword);

export default router;
