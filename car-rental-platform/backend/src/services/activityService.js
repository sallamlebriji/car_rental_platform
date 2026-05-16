import { prisma } from "../prisma.js";

export async function logActivity({ userId, action, entityType, entityId, description, metadata }) {
  return prisma.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      description,
      metadata
    }
  });
}
