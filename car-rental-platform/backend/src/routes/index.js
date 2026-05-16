import { Router } from "express";
import authRoutes from "./authRoutes.js";
import carsRoutes from "./carsRoutes.js";
import reservationsRoutes from "./reservationsRoutes.js";
import clientsRoutes from "./clientsRoutes.js";
import employeesRoutes from "./employeesRoutes.js";
import packsRoutes from "./packsRoutes.js";
import optionsRoutes from "./optionsRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import contractsRoutes from "./contractsRoutes.js";
import agenciesRoutes from "./agenciesRoutes.js";
import platformRoutes from "./platformRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cars", carsRoutes);
router.use("/reservations", reservationsRoutes);
router.use("/clients", clientsRoutes);
router.use("/employees", employeesRoutes);
router.use("/packs", packsRoutes);
router.use("/options", optionsRoutes);
router.use("/settings", settingsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/contracts", contractsRoutes);
router.use("/agencies", agenciesRoutes);
router.use("/platform", platformRoutes);

export default router;
