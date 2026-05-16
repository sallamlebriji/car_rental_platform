import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";

function buildAgencyClientFilter(req) {
  if (req.user?.type === "SUPER_ADMIN") {
    return { deletedAt: null };
  }

  return {
    deletedAt: null,
    user: {
      agencyId: req.user?.agencyId || undefined
    }
  };
}

async function getAccessibleClient(req, clientId) {
  return prisma.client.findFirst({
    where: {
      id: clientId,
      ...buildAgencyClientFilter(req)
    }
  });
}

export const getClients = asyncHandler(async (req, res) => {
  const clients = await prisma.client.findMany({
    where: buildAgencyClientFilter(req),
    include: {
      user: {
        include: {
          agency: true
        }
      },
      reservations: { include: { car: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  res.json(clients);
});

export const getClientById = asyncHandler(async (req, res) => {
  const client = await prisma.client.findFirst({
    where: {
      id: req.params.id,
      ...buildAgencyClientFilter(req)
    },
    include: {
      user: {
        include: {
          agency: true
        }
      },
      reservations: { include: { car: true, pack: true, payments: true } }
    }
  });
  res.json(client);
});

export const createClient = asyncHandler(async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password || "password123", 10);
  const client = await prisma.client.create({
    data: {
      city: req.body.city,
      address: req.body.address,
      cinOrPassport: req.body.cinOrPassport,
      driverLicense: req.body.driverLicense,
      identityDocUrl: req.body.identityDocUrl,
      licenseDocUrl: req.body.licenseDocUrl,
      isBlocked: Boolean(req.body.isBlocked),
      internalNote: req.body.internalNote,
      user: {
        create: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          passwordHash,
          type: "CLIENT",
          isActive: req.body.isActive ?? true,
          agencyId: req.user?.agencyId || req.body.agencyId
        }
      }
    },
    include: {
      user: {
        include: {
          agency: true
        }
      },
      reservations: { include: { car: true } }
    }
  });
  res.status(201).json(client);
});

export const updateClient = asyncHandler(async (req, res) => {
  const accessibleClient = await getAccessibleClient(req, req.params.id);
  if (!accessibleClient) {
    return res.status(404).json({ message: "Client introuvable." });
  }

  const client = await prisma.client.update({
    where: { id: accessibleClient.id },
    data: {
      city: req.body.city,
      address: req.body.address,
      cinOrPassport: req.body.cinOrPassport,
      driverLicense: req.body.driverLicense,
      identityDocUrl: req.body.identityDocUrl,
      licenseDocUrl: req.body.licenseDocUrl,
      isBlocked: req.body.isBlocked,
      internalNote: req.body.internalNote,
      user: req.body.user
        ? {
            update: req.body.user
          }
        : undefined
    },
    include: {
      user: {
        include: {
          agency: true
        }
      },
      reservations: { include: { car: true } }
    }
  });
  res.json(client);
});

export const approveClient = asyncHandler(async (req, res) => {
  const accessibleClient = await getAccessibleClient(req, req.params.id);
  if (!accessibleClient) {
    return res.status(404).json({ message: "Client introuvable." });
  }

  const client = await prisma.client.update({
    where: { id: accessibleClient.id },
    data: {
      user: {
        update: {
          isActive: true
        }
      }
    },
    include: {
      user: {
        include: {
          agency: true
        }
      },
      reservations: { include: { car: true } }
    }
  });
  res.json(client);
});

export const deleteClient = asyncHandler(async (req, res) => {
  const accessibleClient = await getAccessibleClient(req, req.params.id);
  if (!accessibleClient) {
    return res.status(404).json({ message: "Client introuvable." });
  }

  await prisma.client.update({
    where: { id: accessibleClient.id },
    data: { deletedAt: new Date() }
  });
  res.json({ message: "Client supprime" });
});
