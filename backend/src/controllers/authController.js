import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { UserType } from "@prisma/client";
import { prisma } from "../prisma.js";
import { signToken } from "../utils/jwt.js";
import { ApiError } from "../utils/errors.js";
import { logActivity } from "../services/activityService.js";

function authResponse(user) {
  const token = signToken({ userId: user.id });
  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      type: user.type,
      role: user.role?.name
    }
  };
}

export const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    city,
    address,
    cinOrPassport,
    driverLicense,
    agencyId,
    agencySlug
  } = req.body;

  if (!agencyId && !agencySlug) throw new ApiError(400, "Agence obligatoire pour l'inscription client");

  const agency = await prisma.agency.findFirst({
    where: {
      deletedAt: null,
      isActive: true,
      ...(agencyId ? { id: agencyId } : { slug: agencySlug })
    }
  });

  if (!agency) throw new ApiError(400, "Agence invalide ou inactive");

  const existing = await prisma.user.findUnique({
    where: { email },
    include: { client: true }
  });
  if (existing && existing.passwordHash !== "guest-account") {
    throw new ApiError(400, "Email deja utilise");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let user;

  if (existing) {
    user = await prisma.user.update({
      where: { id: existing.id },
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        phone,
        type: UserType.CLIENT,
        isActive: false,
        agencyId: agency.id,
        client: existing.client
          ? {
              update: {
                city,
                address,
                cinOrPassport,
                driverLicense
              }
            }
          : {
              create: {
                city,
                address,
                cinOrPassport,
                driverLicense
              }
            }
      },
      include: {
        role: true
      }
    });
  } else {
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        phone,
        type: UserType.CLIENT,
        isActive: false,
        agencyId: agency.id,
        client: {
          create: {
            city,
            address,
            cinOrPassport,
            driverLicense
          }
        }
      },
      include: {
        role: true
      }
    });
  }

  await logActivity({
    userId: user.id,
    action: "REGISTER",
    entityType: "user",
    entityId: user.id,
    description: "Nouveau client inscrit en attente de validation"
  });

  res.status(201).json({
    message: "Votre compte client a ete cree. Il sera actif apres validation par l'agence.",
    status: "PENDING_APPROVAL",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, portal, agencySlug } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true, agency: true }
  });

  if (!user) throw new ApiError(401, "Identifiants invalides");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new ApiError(401, "Identifiants invalides");

  if (portal === "client" && user.type !== UserType.CLIENT) {
    throw new ApiError(403, "Ce compte n'est pas autorise sur l'espace client");
  }

  if (portal === "agency" && ![UserType.ADMIN, UserType.EMPLOYEE, UserType.SUPER_ADMIN].includes(user.type)) {
    throw new ApiError(403, "Ce compte n'est pas autorise sur l'espace agence");
  }

  if (agencySlug && user.type !== UserType.SUPER_ADMIN && user.agency?.slug !== agencySlug) {
    throw new ApiError(403, "Ce compte n'est pas rattache a cette agence.");
  }

  if (!user.isActive && user.type === UserType.CLIENT) {
    throw new ApiError(403, "Compte client en attente de validation par l'agence");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Compte inactif");
  }

  await logActivity({
    userId: user.id,
    action: "LOGIN",
    entityType: "user",
    entityId: user.id,
    description: "Connexion reussie"
  });

  res.json(authResponse(user));
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ message: "Deconnexion reussie" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      role: {
        include: {
          rolePermissions: { include: { permission: true } }
        }
      },
      employee: true,
      client: true,
      agency: true
    }
  });

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    type: user.type,
    role: user.role,
    agency: user.agency,
    permissions: user.role?.rolePermissions?.map((item) => item.permission.code) || [],
    employee: user.employee,
    client: user.client
  });
});

export const changeMyPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (!user) throw new ApiError(404, "Utilisateur introuvable");

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) throw new ApiError(400, "Mot de passe actuel incorrect");

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash }
  });

  await logActivity({
    userId: user.id,
    action: "CHANGE_PASSWORD",
    entityType: "user",
    entityId: user.id,
    description: "Mot de passe modifie par l'utilisateur"
  });

  res.json({ message: "Mot de passe mis a jour." });
});
