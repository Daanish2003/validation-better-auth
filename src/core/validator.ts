import { createAuthMiddleware } from "better-auth/api";
import { BetterAuthPlugin } from "better-auth/types";
import { ValidationConfig } from "../types";
import { runValidationPipeline } from "./pipeline";

export const validator = (configs: ValidationConfig[]): BetterAuthPlugin => {
  return {
    id: "validator",
    middlewares: configs.map((config) => ({
      path: config.path,
      middleware: createAuthMiddleware(async (ctx) => {
        await runValidationPipeline(config, ctx);
      }),
    })),
  };
};
