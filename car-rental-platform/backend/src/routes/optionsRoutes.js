import { Router } from "express";
import { createOption, deleteOption, getOptions, updateOption } from "../controllers/optionsController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getOptions);
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), createOption);
router.put("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), updateOption);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), deleteOption);

export default router;
