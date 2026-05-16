import { Router } from "express";
import { getAuditLogs, getFeatureFlags, updateFeatureFlags } from "../controllers/platformController.js";
import { authenticate, requirePermission } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/audit-logs", authenticate, requirePermission("audit.logs.view"), getAuditLogs);
router.get("/feature-flags", authenticate, requirePermission("featureflags.manage"), getFeatureFlags);
router.put("/feature-flags", authenticate, requirePermission("featureflags.manage"), updateFeatureFlags);

export default router;
