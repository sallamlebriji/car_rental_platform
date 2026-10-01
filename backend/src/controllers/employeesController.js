import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";

export const getEmployees = asyncHandler(async (_req, res) => {
  const employees = await prisma.employee.findMany({
    where: { deletedAt: null },
    include: {
      user: true,
      role: true
    }
  });
  res.json(employees);
});

export const createEmployee = asyncHandler(async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password || "password123", 10);
  const employee = await prisma.employee.create({
    data: {
      title: req.body.title,
      role: req.body.roleId ? { connect: { id: req.body.roleId } } : undefined,
      user: {
        create: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          passwordHash,
          type: "EMPLOYEE",
          roleId: req.body.roleId,
          agencyId: req.user.agencyId || req.body.agencyId
        }
      }
    },
    include: { user: true, role: true }
  });
  res.status(201).json(employee);
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await prisma.employee.update({
    where: { id: req.params.id },
    data: {
      title: req.body.title,
      role: req.body.roleId ? { connect: { id: req.body.roleId } } : { disconnect: true },
      isActive: req.body.isActive,
      user: {
        update: {
          roleId: req.body.roleId || null
        }
      }
    },
    include: { user: true, role: true }
  });
  res.json(employee);
});

export const resetEmployeePassword = asyncHandler(async (req, res) => {
  const employee = await prisma.employee.findUnique({
    where: { id: req.params.id },
    include: { user: true }
  });

  if (!employee) {
    return res.status(404).json({ message: "Employe introuvable." });
  }

  const passwordHash = await bcrypt.hash(req.body.newPassword || "password123", 10);

  await prisma.user.update({
    where: { id: employee.userId },
    data: { passwordHash }
  });

  res.json({ message: "Mot de passe employe reinitialise." });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  await prisma.employee.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date(), isActive: false }
  });
  res.json({ message: "Employé supprimé" });
});
