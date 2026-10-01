import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

async function createAgencyDefaults(agency) {
  await prisma.agencySetting.upsert({
    where: { agencyId: agency.id },
    update: {},
    create: {
      agencyId: agency.id,
      agencyName: agency.name,
      address: agency.address,
      phone: agency.phone,
      email: agency.email,
      whatsapp: agency.whatsapp,
      website: agency.website,
      description: agency.description
    }
  });

  await prisma.visualSetting.upsert({
    where: { agencyId: agency.id },
    update: {},
    create: {
      agencyId: agency.id,
      primaryColor: "#0f766e",
      secondaryColor: "#f59e0b",
      themeMode: "light",
      homepageText: `Bienvenue chez ${agency.name}.`
    }
  });

  await prisma.reservationSetting.upsert({
    where: { agencyId: agency.id },
    update: {},
    create: {
      agencyId: agency.id,
      minimumRentalDays: 1,
      maximumRentalDays: 30,
      bookingFees: 100,
      requiredAdvancePercent: 20,
      defaultDepositAmount: 3000,
      cancellationPolicy: "Annulation gratuite jusqu'a 48h avant le depart.",
      generalTerms: "Permis valide et caution obligatoire.",
      reservationSuccessMessage: "Votre demande a bien ete enregistree.",
      allowGuestReservation: true,
      allowOnlinePayment: false,
      allowDocumentUpload: true
    }
  });

  await prisma.notificationSetting.upsert({
    where: { agencyId: agency.id },
    update: {},
    create: {
      agencyId: agency.id,
      emailNotificationsEnabled: false,
      whatsappNotificationsEnabled: false,
      internalNotificationsEnabled: true
    }
  });

  await prisma.documentSetting.upsert({
    where: { agencyId: agency.id },
    update: {},
    create: {
      agencyId: agency.id,
      contractTemplate: `Contrat de location ${agency.name}`
    }
  });
}

export const getAgencies = asyncHandler(async (_req, res) => {
  const agencies = await prisma.agency.findMany({
    where: { deletedAt: null },
    include: {
      _count: {
        select: {
          users: true,
          cars: true,
          reservations: true
        }
      },
      agencySetting: true,
      visualSetting: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(agencies);
});

export const getPublicAgencies = asyncHandler(async (_req, res) => {
  const agencies = await prisma.agency.findMany({
    where: {
      deletedAt: null,
      isActive: true
    },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      country: true,
      logoUrl: true,
      coverImageUrl: true,
      visualSetting: {
        select: {
          primaryColor: true,
          secondaryColor: true
        }
      }
    },
    orderBy: { name: "asc" }
  });

  res.json(agencies);
});

export const getPublicAgencyBySlug = asyncHandler(async (req, res) => {
  const agency = await prisma.agency.findFirst({
    where: {
      slug: req.params.slug,
      deletedAt: null,
      isActive: true
    },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      country: true,
      logoUrl: true,
      coverImageUrl: true,
      visualSetting: {
        select: {
          primaryColor: true,
          secondaryColor: true
        }
      }
    }
  });

  if (!agency) {
    return res.status(404).json({ message: "Agence introuvable." });
  }

  res.json(agency);
});

export const getAgencyById = asyncHandler(async (req, res) => {
  const agency = await prisma.agency.findUnique({
    where: { id: req.params.id },
    include: {
      agencySetting: true,
      visualSetting: true,
      reservationSetting: true,
      notificationSetting: true,
      documentSetting: true,
      users: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          type: true
        }
      },
      _count: {
        select: {
          cars: true,
          reservations: true,
          users: true
        }
      }
    }
  });

  res.json(agency);
});

export const createAgency = asyncHandler(async (req, res) => {
  const agency = await prisma.agency.create({
    data: {
      name: req.body.name,
      slug: req.body.slug,
      code: req.body.code,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website,
      whatsapp: req.body.whatsapp,
      logoUrl: req.body.logoUrl,
      coverImageUrl: req.body.coverImageUrl,
      isActive: req.body.isActive ?? true
    }
  });

  await createAgencyDefaults(agency);
  res.status(201).json(await prisma.agency.findUnique({ where: { id: agency.id }, include: { agencySetting: true, visualSetting: true } }));
});

export const updateAgency = asyncHandler(async (req, res) => {
  const agency = await prisma.agency.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name,
      slug: req.body.slug,
      code: req.body.code,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website,
      whatsapp: req.body.whatsapp,
      logoUrl: req.body.logoUrl,
      coverImageUrl: req.body.coverImageUrl,
      isActive: req.body.isActive
    }
  });

  res.json(agency);
});

export const deleteAgency = asyncHandler(async (req, res) => {
  await prisma.agency.update({
    where: { id: req.params.id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });

  res.json({ message: "Agence desactivee" });
});
