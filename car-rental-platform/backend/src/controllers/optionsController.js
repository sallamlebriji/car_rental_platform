import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

export const getOptions = asyncHandler(async (_req, res) => {
  res.json(await prisma.option.findMany({ where: { deletedAt: null, isActive: true }, orderBy: { createdAt: "desc" } }));
});

export const createOption = asyncHandler(async (req, res) => {
  res.status(201).json(await prisma.option.create({ data: req.body }));
});

export const updateOption = asyncHandler(async (req, res) => {
  res.json(await prisma.option.update({ where: { id: req.params.id }, data: req.body }));
});

export const deleteOption = asyncHandler(async (req, res) => {
  await prisma.option.update({ where: { id: req.params.id }, data: { deletedAt: new Date(), isActive: false } });
  res.json({ message: "Option supprimée" });
});
