import { Router } from "express";
import { createEmployee, deleteEmployee, getEmployees, resetEmployeePassword, updateEmployee } from "../controllers/employeesController.js";
import { authenticate, requirePermission } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticate, requirePermission("employees.manage"), getEmployees);
router.post("/", authenticate, requirePermission("employees.manage"), createEmployee);
router.put("/:id", authenticate, requirePermission("employees.manage"), updateEmployee);
router.post("/:id/reset-password", authenticate, requirePermission("employees.manage"), resetEmployeePassword);
router.delete("/:id", authenticate, requirePermission("employees.manage"), deleteEmployee);

export default router;
