import { BetterAuthPlugin } from "better-auth/types";
import { createAuthMiddleware } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { ValidationConfig } from "../types";
import { Endpoint } from "better-auth/*";

export const validator = (configs: ValidationConfig[]): BetterAuthPlugin => {
  return {
    id: "validator",
    middlewares: configs.map(({ path, adapter }) => ({
      path,
      middleware: createAuthMiddleware(async (ctx) => {
        try {
          const result = await adapter.validate(ctx.body);

          if (result.error) {
            throw new APIError("BAD_REQUEST", {
              message: "Validation failed",
              details: result.error,
            });
          }

          ctx.body = result.data;
        } catch (error) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Invalid Fields",
            details: error,
          });
        }
      }) as Endpoint,
    })),
  };
};