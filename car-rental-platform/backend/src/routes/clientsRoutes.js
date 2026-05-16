import { Router } from "express";
import { approveClient, createClient, deleteClient, getClientById, getClients, updateClient } from "../controllers/clientsController.js";
import { authenticate, requirePermission } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticate, requirePermission("clients.manage"), getClients);
router.get("/:id", authenticate, requirePermission("clients.manage"), getClientById);
router.post("/", authenticate, requirePermission("clients.manage"), createClient);
router.patch("/:id/approve", authenticate, requirePermission("clients.manage"), approveClient);
router.put("/:id", authenticate, requirePermission("clients.manage"), updateClient);
router.delete("/:id", authenticate, requirePermission("clients.manage"), deleteClient);

export default router;
