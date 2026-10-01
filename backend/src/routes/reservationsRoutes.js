import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  getReservationById,
  getReservations,
  uploadReservationDocument,
  updateReservation,
  updateReservationStatus
} from "../controllers/reservationsController.js";
import { authenticate, requirePermission } from "../middlewares/authMiddleware.js";
import { uploadDocument } from "../utils/upload.js";

const router = Router();

router.post("/upload-document", uploadDocument.single("document"), uploadReservationDocument);
router.get("/", authenticate, getReservations);
router.get("/:id", authenticate, getReservationById);
router.post("/", createReservation);
router.put("/:id", authenticate, requirePermission("reservations.edit"), updateReservation);
router.patch("/:id/status", authenticate, requirePermission("reservations.edit"), updateReservationStatus);
router.delete("/:id", authenticate, requirePermission("reservations.delete"), deleteReservation);

export default router;
