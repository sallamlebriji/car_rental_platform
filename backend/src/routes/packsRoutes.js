import { Router } from "express";
import { createPack, deletePack, getPacks, updatePack } from "../controllers/packsController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getPacks);
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), createPack);
router.put("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), updatePack);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), deletePack);

export default router;
