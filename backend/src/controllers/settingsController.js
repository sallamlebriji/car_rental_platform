import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

async function resolveAgencyId(req) {
  if (req.query.agencyId) return req.query.agencyId;
  if (req.body.agencyId) return req.body.agencyId;
  if (req.user?.agencyId) return req.user.agencyId;

  const agency = await prisma.agency.findFirst({
    where: { deletedAt: null, isActive: true },
    orderBy: { createdAt: "asc" }
  });

  return agency?.id;
}

async function upsertByAgency(model, agencyId, data) {
  return model.upsert({
    where: { agencyId },
    update: { ...data, agencyId: undefined },
    create: { ...data, agencyId }
  });
}

export const getAllSettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  const [agency, visual, reservation, notifications, documents, roles] = await Promise.all([
    prisma.agencySetting.findFirst({ where: { agencyId } }),
    prisma.visualSetting.findFirst({ where: { agencyId } }),
    prisma.reservationSetting.findFirst({ where: { agencyId } }),
    prisma.notificationSetting.findFirst({ where: { agencyId } }),
    prisma.documentSetting.findFirst({ where: { agencyId } }),
    prisma.role.findMany({
      include: {
        rolePermissions: { include: { permission: true } }
      }
    })
  ]);

  res.json({ agency, visual, reservation, notifications, documents, roles });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const result = await prisma.appSetting.upsert({
    where: { key: req.body.key },
    update: { value: req.body.value },
    create: { key: req.body.key, value: req.body.value }
  });
  res.json(result);
});

export const getAgencySettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await prisma.agencySetting.findFirst({ where: { agencyId } }));
});

export const updateAgencySettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await upsertByAgency(prisma.agencySetting, agencyId, req.body));
});

export const getVisualSettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await prisma.visualSetting.findFirst({ where: { agencyId } }));
});

export const updateVisualSettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await upsertByAgency(prisma.visualSetting, agencyId, req.body));
});

export const uploadSettingsAsset = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier image n'a ete envoye." });
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({
    url,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype
  });
});

export const getReservationSettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await prisma.reservationSetting.findFirst({ where: { agencyId } }));
});

export const updateReservationSettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await upsertByAgency(prisma.reservationSetting, agencyId, req.body));
});

export const getNotificationSettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await prisma.notificationSetting.findFirst({ where: { agencyId } }));
});

export const updateNotificationSettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await upsertByAgency(prisma.notificationSetting, agencyId, req.body));
});

export const getDocumentSettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await prisma.documentSetting.findFirst({ where: { agencyId } }));
});

export const updateDocumentSettings = asyncHandler(async (req, res) => {
  const agencyId = await resolveAgencyId(req);
  res.json(await upsertByAgency(prisma.documentSetting, agencyId, req.body));
});

export const getRolesPermissions = asyncHandler(async (_req, res) => {
  const roles = await prisma.role.findMany({
    include: {
      rolePermissions: {
        include: { permission: true }
      }
    }
  });
  const permissions = await prisma.permission.findMany();
  res.json({ roles, permissions });
});

export const createRole = asyncHandler(async (req, res) => {
  const { name, code, description, permissionIds = [], isSystem = false } = req.body;

  const role = await prisma.role.create({
    data: {
      name,
      code,
      description,
      isSystem,
      rolePermissions: {
        create: permissionIds.map((permissionId) => ({ permissionId }))
      }
    },
    include: {
      rolePermissions: {
        include: { permission: true }
      }
    }
  });

  res.status(201).json(role);
});

export const updateRole = asyncHandler(async (req, res) => {
  const { name, code, description, permissionIds = [] } = req.body;
  const roleId = req.params.roleId;

  await prisma.rolePermission.deleteMany({
    where: { roleId }
  });

  const role = await prisma.role.update({
    where: { id: roleId },
    data: {
      name,
      code,
      description,
      rolePermissions: {
        create: permissionIds.map((permissionId) => ({ permissionId }))
      }
    },
    include: {
      rolePermissions: {
        include: { permission: true }
      }
    }
  });

  res.json(role);
});

export const deleteRole = asyncHandler(async (req, res) => {
  const role = await prisma.role.findUnique({ where: { id: req.params.roleId } });

  if (role?.isSystem) {
    return res.status(400).json({ message: "Les roles systeme ne peuvent pas etre supprimes." });
  }

  await prisma.rolePermission.deleteMany({
    where: { roleId: req.params.roleId }
  });

  await prisma.role.delete({
    where: { id: req.params.roleId }
  });

  res.json({ message: "Role supprime." });
});
