import { Router } from "express";
import {
  getAgencySettings,
  getAllSettings,
  getDocumentSettings,
  getNotificationSettings,
  getReservationSettings,
  getRolesPermissions,
  getVisualSettings,
  createRole,
  deleteRole,
  updateAgencySettings,
  updateDocumentSettings,
  updateNotificationSettings,
  updateReservationSettings,
  updateRole,
  updateSettings,
  updateVisualSettings,
  uploadSettingsAsset
} from "../controllers/settingsController.js";
import { authenticate, requirePermission } from "../middlewares/authMiddleware.js";
import { upload } from "../utils/upload.js";

const router = Router();

router.get("/", getAllSettings);
router.put("/", authenticate, requirePermission("settings.manage"), updateSettings);
router.post("/upload-image", authenticate, requirePermission("settings.manage"), upload.single("image"), uploadSettingsAsset);
router.get("/agency", getAgencySettings);
router.put("/agency", authenticate, requirePermission("settings.manage"), updateAgencySettings);
router.get("/visual", getVisualSettings);
router.put("/visual", authenticate, requirePermission("settings.manage"), updateVisualSettings);
router.get("/reservation", getReservationSettings);
router.put("/reservation", authenticate, requirePermission("settings.manage"), updateReservationSettings);
router.get("/notifications", authenticate, requirePermission("settings.manage"), getNotificationSettings);
router.put("/notifications", authenticate, requirePermission("settings.manage"), updateNotificationSettings);
router.get("/documents", authenticate, requirePermission("settings.manage"), getDocumentSettings);
router.put("/documents", authenticate, requirePermission("settings.manage"), updateDocumentSettings);
router.get("/roles-permissions", authenticate, requirePermission("settings.manage"), getRolesPermissions);
router.post("/roles-permissions", authenticate, requirePermission("settings.manage"), createRole);
router.put("/roles-permissions/:roleId", authenticate, requirePermission("settings.manage"), updateRole);
router.delete("/roles-permissions/:roleId", authenticate, requirePermission("settings.manage"), deleteRole);

export default router;
