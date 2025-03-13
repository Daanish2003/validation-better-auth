import { BetterAuthPlugin } from "better-auth/types";
import { APIError } from "better-auth/api";
import { ValidationConfig } from "../types";

export const validator = (configs: ValidationConfig[]): BetterAuthPlugin => {
  return {
    id: "validator",
    hooks: {
      before: configs.map(({ path, adapter }) => ({
        matcher: (ctx) => ctx.path.startsWith(path),
        handler: async (ctx) => {
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
        },
      })),
    },
  };
};
