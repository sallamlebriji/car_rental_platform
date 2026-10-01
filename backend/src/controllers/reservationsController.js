import asyncHandler from "express-async-handler";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/errors.js";
import { buildReservationPayload } from "../services/reservationService.js";
import { logActivity } from "../services/activityService.js";

async function ensureClient(body, user) {
  if (user?.clientId) {
    return prisma.client.findUnique({ where: { id: user.clientId }, include: { user: true } });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
    include: { client: { include: { user: true } } }
  });
  if (existingUser?.client) return existingUser.client;

  const createdUser = await prisma.user.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      passwordHash: "guest-account",
      type: "CLIENT",
      agencyId: body.agencyId,
      client: {
        create: {
          city: body.city,
          address: body.address,
          cinOrPassport: body.cinOrPassport,
          driverLicense: body.driverLicense,
          identityDocUrl: body.identityDocUrl,
          licenseDocUrl: body.licenseDocUrl
        }
      }
    },
    include: { client: { include: { user: true } } }
  });

  return createdUser.client;
}

export const getReservations = asyncHandler(async (req, res) => {
  const { status, search, startDate, endDate } = req.query;
  const where = {
    deletedAt: null,
    agencyId: req.user.type === "SUPER_ADMIN" ? undefined : req.user.agencyId,
    status: status || undefined,
    startDate: startDate ? { gte: new Date(startDate) } : undefined,
    endDate: endDate ? { lte: new Date(endDate) } : undefined,
    OR: search ? [
      { reference: { contains: search, mode: "insensitive" } },
      { client: { user: { firstName: { contains: search, mode: "insensitive" } } } },
      { client: { user: { lastName: { contains: search, mode: "insensitive" } } } },
      { client: { user: { phone: { contains: search, mode: "insensitive" } } } },
      { car: { plateNumber: { contains: search, mode: "insensitive" } } }
    ] : undefined
  };

  if (req.user.type === "CLIENT") {
    where.clientId = req.user.clientId;
  }

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      car: true,
      client: { include: { user: true } },
      pack: true,
      options: { include: { option: true } },
      payments: true,
      contract: true,
      employee: { include: { user: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(reservations);
});

export const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id: req.params.id },
    include: {
      car: { include: { images: true } },
      client: { include: { user: true } },
      pack: true,
      options: { include: { option: true } },
      payments: true,
      contract: true,
      employee: { include: { user: true } }
    }
  });

  if (!reservation) throw new ApiError(404, "Réservation introuvable");
  if (req.user.type === "CLIENT" && reservation.clientId !== req.user.clientId) {
    throw new ApiError(403, "Accès interdit");
  }

  res.json(reservation);
});

export const createReservation = asyncHandler(async (req, res) => {
  const { reference, car, pack, options, pricing, reservationSettings } = await buildReservationPayload(req.body);

  if (!req.user && reservationSettings && !reservationSettings.allowGuestReservation) {
    throw new ApiError(403, "Cette agence n'autorise pas les reservations sans compte valide.");
  }

  if (req.user?.type === "CLIENT" && req.user.agencyId && req.user.agencyId !== car.agencyId) {
    throw new ApiError(403, "Votre compte client n'est pas rattache a cette agence.");
  }

  const client = await ensureClient({ ...req.body, agencyId: car.agencyId }, req.user);

  const reservation = await prisma.reservation.create({
    data: {
      reference,
      agencyId: car.agencyId,
      clientId: client.id,
      carId: req.body.carId,
      packId: req.body.packId || null,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      totalDays: pricing.totalDays,
      basePrice: pricing.basePrice,
      packPrice: pricing.packPrice,
      optionsPrice: pricing.optionsPrice,
      bookingFees: pricing.bookingFees,
      totalPrice: pricing.totalPrice,
      advanceAmount: pricing.advanceAmount,
      remainingAmount: pricing.remainingAmount,
      options: {
        create: options.map((option) => ({
          optionId: option.id,
          name: option.name,
          price: option.price,
          pricingType: option.pricingType
        }))
      },
      payments: {
        create: {
          amountTotal: pricing.totalPrice,
          amountPaid: pricing.advanceAmount,
          remaining: pricing.remainingAmount,
          method: PaymentMethod.CASH,
          status: pricing.advanceAmount > 0 ? PaymentStatus.PARTIALLY_PAID : PaymentStatus.UNPAID
        }
      }
    },
    include: {
      car: true,
      client: { include: { user: true } },
      pack: true,
      options: true,
      payments: true
    }
  });

  await logActivity({
    userId: req.user?.id,
    action: "CREATE_RESERVATION",
    entityType: "reservation",
    entityId: reservation.id,
    description: `Réservation ${reservation.reference} créée`
  });

  res.status(201).json(reservation);
});

export const uploadReservationDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Aucun document n'a ete envoye.");
  }

  const agencyId = req.body.agencyId || req.query.agencyId;
  if (!agencyId) {
    throw new ApiError(400, "Agence obligatoire pour l'import du document.");
  }

  const reservationSettings = await prisma.reservationSetting.findFirst({
    where: { agencyId }
  });

  if (reservationSettings && !reservationSettings.allowDocumentUpload) {
    throw new ApiError(403, "L'upload de documents est desactive pour cette agence.");
  }

  const documentUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({
    url: documentUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype
  });
});

export const updateReservation = asyncHandler(async (req, res) => {
  const existing = await prisma.reservation.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new ApiError(404, "Réservation introuvable");

  const { pack, options, pricing } = await buildReservationPayload({
    ...req.body,
    carId: req.body.carId || existing.carId,
    startDate: req.body.startDate || existing.startDate,
    endDate: req.body.endDate || existing.endDate,
    packId: req.body.packId || existing.packId,
    optionIds: req.body.optionIds,
    excludeReservationId: existing.id
  });

  await prisma.reservationOption.deleteMany({ where: { reservationId: existing.id } });

  const reservation = await prisma.reservation.update({
    where: { id: existing.id },
    data: {
      agencyId: existing.agencyId,
      carId: req.body.carId || existing.carId,
      packId: req.body.packId ?? existing.packId,
      employeeId: req.body.employeeId ?? existing.employeeId,
      startDate: req.body.startDate ? new Date(req.body.startDate) : existing.startDate,
      endDate: req.body.endDate ? new Date(req.body.endDate) : existing.endDate,
      totalDays: pricing.totalDays,
      basePrice: pricing.basePrice,
      packPrice: pricing.packPrice,
      optionsPrice: pricing.optionsPrice,
      bookingFees: pricing.bookingFees,
      totalPrice: req.body.finalPrice ? Number(req.body.finalPrice) : pricing.totalPrice,
      advanceAmount: pricing.advanceAmount,
      remainingAmount: pricing.remainingAmount,
      finalPrice: req.body.finalPrice ? Number(req.body.finalPrice) : existing.finalPrice,
      internalNote: req.body.internalNote ?? existing.internalNote,
      options: {
        create: options.map((option) => ({
          optionId: option.id,
          name: option.name,
          price: option.price,
          pricingType: option.pricingType
        }))
      }
    },
    include: {
      car: true,
      client: { include: { user: true } },
      pack: true,
      options: true,
      employee: { include: { user: true } }
    }
  });

  res.json(reservation);
});

export const updateReservationStatus = asyncHandler(async (req, res) => {
  const reservation = await prisma.reservation.update({
    where: { id: req.params.id },
    data: { status: req.body.status }
  });

  await logActivity({
    userId: req.user.id,
    action: "UPDATE_RESERVATION_STATUS",
    entityType: "reservation",
    entityId: reservation.id,
    description: `Statut changé vers ${reservation.status}`
  });

  res.json(reservation);
});

export const deleteReservation = asyncHandler(async (req, res) => {
  await prisma.reservation.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date() }
  });

  res.json({ message: "Réservation supprimée" });
});
