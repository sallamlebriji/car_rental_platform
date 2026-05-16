import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

export const getPacks = asyncHandler(async (_req, res) => {
  res.json(await prisma.pack.findMany({ where: { deletedAt: null, isActive: true }, orderBy: { createdAt: "desc" } }));
});

export const createPack = asyncHandler(async (req, res) => {
  res.status(201).json(await prisma.pack.create({ data: req.body }));
});

export const updatePack = asyncHandler(async (req, res) => {
  res.json(await prisma.pack.update({ where: { id: req.params.id }, data: req.body }));
});

export const deletePack = asyncHandler(async (req, res) => {
  await prisma.pack.update({ where: { id: req.params.id }, data: { deletedAt: new Date(), isActive: false } });
  res.json({ message: "Pack supprimé" });
});
