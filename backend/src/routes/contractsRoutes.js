import { Router } from "express";
import { downloadContract, generateContract } from "../controllers/contractsController.js";
import { authenticate, requirePermission } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/generate/:reservationId", authenticate, requirePermission("contracts.generate"), generateContract);
router.get("/:id/download", authenticate, requirePermission("contracts.generate"), downloadContract);

export default router;
