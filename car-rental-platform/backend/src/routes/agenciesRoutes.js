import { Router } from "express";
import { createAgency, deleteAgency, getAgencyById, getAgencies, getPublicAgencies, getPublicAgencyBySlug, updateAgency } from "../controllers/agenciesController.js";
import { authenticate, requirePermission } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/public/list", getPublicAgencies);
router.get("/public/slug/:slug", getPublicAgencyBySlug);
router.get("/", authenticate, requirePermission("agencies.manage"), getAgencies);
router.post("/", authenticate, requirePermission("agencies.manage"), createAgency);
router.get("/:id", authenticate, requirePermission("agencies.manage"), getAgencyById);
router.put("/:id", authenticate, requirePermission("agencies.manage"), updateAgency);
router.delete("/:id", authenticate, requirePermission("agencies.manage"), deleteAgency);

export default router;
