import { Router } from "express";
import { getDashboardStats, getReservationsChart, getRevenue, getSuperAdminOverview, getTopCars } from "../controllers/dashboardController.js";
import { authenticate, requirePermission } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/stats", authenticate, requirePermission("dashboard.view"), getDashboardStats);
router.get("/super-admin-overview", authenticate, requirePermission("agencies.manage"), getSuperAdminOverview);
router.get("/revenue", authenticate, requirePermission("dashboard.view"), getRevenue);
router.get("/reservations-chart", authenticate, requirePermission("dashboard.view"), getReservationsChart);
router.get("/top-cars", authenticate, requirePermission("dashboard.view"), getTopCars);

export default router;
