import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";
import { logActivity } from "../services/activityService.js";

function buildCarsWhere(req, query = {}) {
  const { brand, model, type, transmission, fuelType, seats, minPrice, maxPrice, status, agencyId } = query;
  const scopedAgencyId = req.user?.type === "SUPER_ADMIN"
    ? agencyId || undefined
    : req.user?.agencyId || agencyId || undefined;

  return {
    deletedAt: null,
    isActive: true,
    agencyId: scopedAgencyId || undefined,
    brand: brand ? { contains: brand, mode: "insensitive" } : undefined,
    model: model ? { contains: model, mode: "insensitive" } : undefined,
    transmission: transmission || undefined,
    fuelType: fuelType || undefined,
    seats: seats ? Number(seats) : undefined,
    status: status || undefined,
    type: type ? { name: { contains: type, mode: "insensitive" } } : undefined,
    pricePerDay: minPrice || maxPrice ? {
      gte: minPrice ? Number(minPrice) : undefined,
      lte: maxPrice ? Number(maxPrice) : undefined
    } : undefined
  };
}

async function getAccessibleCar(req, id) {
  return prisma.car.findFirst({
    where: {
      id,
      deletedAt: null,
      isActive: true,
      agencyId: req.user?.type === "SUPER_ADMIN"
        ? req.query.agencyId || undefined
        : req.user?.agencyId || req.query.agencyId || undefined
    },
    include: {
      images: true,
      type: true
    }
  });
}

export const getCars = asyncHandler(async (req, res) => {
  const cars = await prisma.car.findMany({
    where: buildCarsWhere(req, req.query),
    include: {
      images: true,
      type: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(cars);
});

export const getCarById = asyncHandler(async (req, res) => {
  const car = await getAccessibleCar(req, req.params.id);
  if (!car) {
    return res.status(404).json({ message: "Voiture introuvable." });
  }
  res.json(car);
});

export const uploadCarImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Aucun fichier image n'a ete envoye.");
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({
    url: imageUrl,
    filename: req.file.filename
  });
});

export const createCar = asyncHandler(async (req, res) => {
  const { images = [], ...payload } = req.body;
  const car = await prisma.car.create({
    data: {
      agencyId: req.user.type === "SUPER_ADMIN" ? payload.agencyId : req.user.agencyId,
      ...payload,
      year: Number(payload.year),
      seats: Number(payload.seats),
      mileage: payload.mileage ? Number(payload.mileage) : null,
      pricePerDay: Number(payload.pricePerDay),
      depositAmount: Number(payload.depositAmount),
      images: {
        create: images.map((url, index) => ({ url, sortOrder: index + 1 }))
      }
    },
    include: { images: true }
  });

  await logActivity({
    userId: req.user.id,
    action: "CREATE_CAR",
    entityType: "car",
    entityId: car.id,
    description: `${car.brand} ${car.model} ajoute`,
    metadata: { agencyId: car.agencyId }
  });

  res.status(201).json(car);
});

export const updateCar = asyncHandler(async (req, res) => {
  const existingCar = await getAccessibleCar(req, req.params.id);
  if (!existingCar) {
    return res.status(404).json({ message: "Voiture introuvable." });
  }

  const { images = [], ...payload } = req.body;
  await prisma.carImage.deleteMany({ where: { carId: existingCar.id } });

  const car = await prisma.car.update({
    where: { id: existingCar.id },
    data: {
      agencyId: req.user.type === "SUPER_ADMIN" ? payload.agencyId || existingCar.agencyId : req.user.agencyId,
      ...payload,
      year: Number(payload.year),
      seats: Number(payload.seats),
      mileage: payload.mileage ? Number(payload.mileage) : null,
      pricePerDay: Number(payload.pricePerDay),
      depositAmount: Number(payload.depositAmount),
      images: {
        create: images.map((url, index) => ({ url, sortOrder: index + 1 }))
      }
    },
    include: { images: true }
  });

  await logActivity({
    userId: req.user.id,
    action: "UPDATE_CAR",
    entityType: "car",
    entityId: car.id,
    description: `${car.brand} ${car.model} modifie`,
    metadata: { agencyId: car.agencyId }
  });

  res.json(car);
});

export const deleteCar = asyncHandler(async (req, res) => {
  const existingCar = await getAccessibleCar(req, req.params.id);
  if (!existingCar) {
    return res.status(404).json({ message: "Voiture introuvable." });
  }

  await prisma.car.update({
    where: { id: existingCar.id },
    data: {
      deletedAt: new Date(),
      isActive: false
    }
  });

  await logActivity({
    userId: req.user.id,
    action: "DELETE_CAR",
    entityType: "car",
    entityId: req.params.id,
    description: "Voiture supprimee logiquement",
    metadata: { agencyId: existingCar.agencyId }
  });

  res.json({ message: "Voiture supprimee" });
});
