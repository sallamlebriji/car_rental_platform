import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const scope = _req.user?.type === "SUPER_ADMIN" ? {} : { agencyId: _req.user?.agencyId };
  const [reservations, cars, revenue, pending, confirmed, cancelled, available, rented] = await Promise.all([
    prisma.reservation.count({ where: { deletedAt: null, ...scope } }),
    prisma.car.count({ where: { deletedAt: null, ...scope } }),
    prisma.reservation.aggregate({ _sum: { totalPrice: true }, where: { deletedAt: null, ...scope } }),
    prisma.reservation.count({ where: { status: "PENDING", deletedAt: null, ...scope } }),
    prisma.reservation.count({ where: { status: "CONFIRMED", deletedAt: null, ...scope } }),
    prisma.reservation.count({ where: { status: "CANCELLED", deletedAt: null, ...scope } }),
    prisma.car.count({ where: { status: "AVAILABLE", deletedAt: null, ...scope } }),
    prisma.car.count({ where: { status: "RENTED", deletedAt: null, ...scope } })
  ]);

  res.json({
    totalReservations: reservations,
    totalCars: cars,
    pendingReservations: pending,
    confirmedReservations: confirmed,
    cancelledReservations: cancelled,
    availableCars: available,
    rentedCars: rented,
    estimatedRevenue: Number(revenue._sum.totalPrice || 0)
  });
});

export const getRevenue = asyncHandler(async (_req, res) => {
  const rows = await prisma.reservation.findMany({
    where: _req.user?.type === "SUPER_ADMIN" ? undefined : { agencyId: _req.user?.agencyId },
    select: { createdAt: true, totalPrice: true },
    orderBy: { createdAt: "asc" }
  });
  res.json(rows);
});

export const getReservationsChart = asyncHandler(async (_req, res) => {
  const rows = await prisma.reservation.findMany({
    where: _req.user?.type === "SUPER_ADMIN" ? undefined : { agencyId: _req.user?.agencyId },
    select: { createdAt: true, status: true },
    orderBy: { createdAt: "asc" }
  });
  res.json(rows);
});

export const getTopCars = asyncHandler(async (_req, res) => {
  const reservations = await prisma.reservation.groupBy({
    by: ["carId"],
    where: _req.user?.type === "SUPER_ADMIN" ? undefined : { agencyId: _req.user?.agencyId },
    _count: { carId: true },
    orderBy: { _count: { carId: "desc" } },
    take: 5
  });

  const cars = await Promise.all(
    reservations.map(async (item) => {
      const car = await prisma.car.findUnique({ where: { id: item.carId } });
      return {
        car,
        reservations: item._count.carId
      };
    })
  );

  res.json(cars);
});

export const getSuperAdminOverview = asyncHandler(async (_req, res) => {
  const [agencies, activeAgencies, agencySummaries] = await Promise.all([
    prisma.agency.count({ where: { deletedAt: null } }),
    prisma.agency.count({ where: { deletedAt: null, isActive: true } }),
    prisma.agency.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: {
            cars: true,
            reservations: true,
            users: true
          }
        },
        agencySetting: true
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  res.json({
    totalAgencies: agencies,
    activeAgencies,
    agencies: agencySummaries
  });
});
