import { prisma } from "../prisma.js";
import { ApiError } from "../utils/errors.js";
import { calculateReservationPricing } from "../utils/priceCalculator.js";
import { generateReservationReference } from "../utils/reference.js";

export async function ensureCarAvailability(carId, startDate, endDate, excludeReservationId) {
  const overlaps = await prisma.reservation.findFirst({
    where: {
      carId,
      id: excludeReservationId ? { not: excludeReservationId } : undefined,
      status: { in: ["PENDING", "CONFIRMED"] },
      startDate: { lte: new Date(endDate) },
      endDate: { gte: new Date(startDate) },
      deletedAt: null
    }
  });

  if (overlaps) {
    throw new ApiError(400, "La voiture n'est pas disponible sur cette période");
  }
}

export async function buildReservationPayload(data) {
  const car = await prisma.car.findUnique({ where: { id: data.carId } });
  if (!car || !car.isActive) throw new ApiError(404, "Voiture introuvable");

  const pack = data.packId
    ? await prisma.pack.findFirst({ where: { id: data.packId, deletedAt: null, isActive: true } })
    : null;
  const options = data.optionIds?.length
    ? await prisma.option.findMany({ where: { id: { in: data.optionIds }, deletedAt: null, isActive: true } })
    : [];
  const reservationSettings = await prisma.reservationSetting.findFirst({
    where: { agencyId: car.agencyId }
  });

  await ensureCarAvailability(data.carId, data.startDate, data.endDate, data.excludeReservationId);

  const pricing = calculateReservationPricing({
    carPricePerDay: car.pricePerDay,
    startDate: data.startDate,
    endDate: data.endDate,
    pack,
    options,
    reservationSettings
  });

  return {
    reference: generateReservationReference(),
    car,
    pack,
    options,
    reservationSettings,
    pricing
  };
}
