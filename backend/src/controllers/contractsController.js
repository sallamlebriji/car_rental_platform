import asyncHandler from "express-async-handler";
import path from "path";
import { prisma } from "../prisma.js";
import { generateContractPdf } from "../services/contractService.js";

export const generateContract = asyncHandler(async (req, res) => {
  const contract = await generateContractPdf(req.params.reservationId);
  res.status(201).json(contract);
});

export const downloadContract = asyncHandler(async (req, res) => {
  const contract = await prisma.contract.findUnique({ where: { id: req.params.id } });
  res.download(path.resolve(contract.fileUrl));
});
