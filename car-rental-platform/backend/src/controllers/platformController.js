import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

const FEATURE_FLAGS_KEY = "feature_flags";

const defaultFeatureFlags = {
  multiAgencyMode: true,
  clientSelfRegistration: true,
  clientApprovalRequired: true,
  onlinePayment: false,
  documentUpload: true,
  advancedContracts: true,
  auditLogs: true,
  agencyBranding: true
};

export const getAuditLogs = asyncHandler(async (req, res) => {
  const { agencyId, action, entityType, q } = req.query;

  const logs = await prisma.activityLog.findMany({
    where: {
      action: action || undefined,
      entityType: entityType || undefined,
      OR: q
        ? [
            { action: { contains: q, mode: "insensitive" } },
            { entityType: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { user: { firstName: { contains: q, mode: "insensitive" } } },
            { user: { lastName: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } }
          ]
        : undefined,
      user: agencyId
        ? {
            agencyId
          }
        : undefined
    },
    include: {
      user: {
        include: {
          agency: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  res.json(logs);
});

export const getFeatureFlags = asyncHandler(async (_req, res) => {
  const setting = await prisma.appSetting.findUnique({
    where: { key: FEATURE_FLAGS_KEY }
  });

  res.json(setting?.value || defaultFeatureFlags);
});

export const updateFeatureFlags = asyncHandler(async (req, res) => {
  const current = await prisma.appSetting.findUnique({
    where: { key: FEATURE_FLAGS_KEY }
  });

  const nextValue = {
    ...defaultFeatureFlags,
    ...(current?.value || {}),
    ...(req.body || {})
  };

  const result = await prisma.appSetting.upsert({
    where: { key: FEATURE_FLAGS_KEY },
    update: { value: nextValue },
    create: {
      key: FEATURE_FLAGS_KEY,
      value: nextValue
    }
  });

  res.json(result.value);
});
