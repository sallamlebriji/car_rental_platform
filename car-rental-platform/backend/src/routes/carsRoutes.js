import { Router } from "express";
import { createCar, deleteCar, getCarById, getCars, updateCar, uploadCarImage } from "../controllers/carsController.js";
import { authenticate, requirePermission } from "../middlewares/authMiddleware.js";
import { upload } from "../utils/upload.js";

const router = Router();

router.get("/", getCars);
router.get("/:id", getCarById);
router.post("/upload", authenticate, requirePermission("cars.manage"), upload.single("image"), uploadCarImage);
router.post("/", authenticate, requirePermission("cars.manage"), createCar);
router.put("/:id", authenticate, requirePermission("cars.manage"), updateCar);
router.delete("/:id", authenticate, requirePermission("cars.manage"), deleteCar);

export default router;
