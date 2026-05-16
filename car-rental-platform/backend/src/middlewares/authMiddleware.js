import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/errors.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentification requise");
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          }
        }
      },
      employee: true,
      client: true
    }
  });

  if (!user || !user.isActive) {
    throw new ApiError(401, "Utilisateur invalide");
  }

  req.user = {
    id: user.id,
    email: user.email,
    type: user.type,
    agencyId: user.agencyId,
    role: user.role,
    permissions: user.role?.rolePermissions?.map((item) => item.permission.code) || [],
    employeeId: user.employee?.id,
    clientId: user.client?.id
  };

  next();
});

export function authorize(...allowed) {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentification requise");
    }

    if (allowed.length === 0 || allowed.includes(req.user.type)) {
      return next();
    }

    throw new ApiError(403, "Accès interdit");
  };
}

export function requirePermission(...permissions) {
  return (req, _res, next) => {
    if (req.user?.type === "SUPER_ADMIN") return next();
    const hasPermission = permissions.every((permission) => req.user?.permissions.includes(permission));
    if (!hasPermission) {
      throw new ApiError(403, "Permissions insuffisantes");
    }
    next();
  };
}
