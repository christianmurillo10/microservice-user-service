import { Request, Response, NextFunction } from "express";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { MESSAGE_DATA_NOT_AUTHORIZED } from "../shared/constants/message.constant";
import redisConfig from "../config/redis.config";

const authorize = (action: string, resource: string) =>
  async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, organizationId, isSuperAdmin } = req.auth;

      // Super admin bypass all permission
      if (isSuperAdmin === true) return next();

      // Validate user id and organization id
      if (!id || !organizationId) {
        throw new UnauthorizedException([MESSAGE_DATA_NOT_AUTHORIZED]);
      }

      // Check permission from redis cache
      const cache = await redisConfig.get(`user_permissions:${id}`);
      if (!cache) {
        throw new UnauthorizedException([MESSAGE_DATA_NOT_AUTHORIZED]);
      }

      // Parse permissions and check
      const permissions: Record<string, string[]> = JSON.parse(cache);
      if (!permissions || !permissions[resource] || !permissions[resource].includes(action)) {
        throw new UnauthorizedException([MESSAGE_DATA_NOT_AUTHORIZED]);
      }

      next();
    } catch (error) {
      next(error);
    };
  };

export default authorize;