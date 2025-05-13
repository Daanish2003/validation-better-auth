import { BetterAuthPlugin } from "better-auth/types";
import { createAuthMiddleware } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { ValidationConfig } from "../types";
import { parseStandardSchema, ValidationError } from "./adapters";

export const validator = (configs: ValidationConfig[]): BetterAuthPlugin => {
  return {
    id: "validator",
    middlewares: configs.map(({ path, schema, before, after, adapter }) => ({
      path,
      middleware: createAuthMiddleware(async (ctx) => {
        try {
          // Pre-validation hook
          if (before) {
            try {
              before(ctx);
            } catch (err) {
              throw new APIError("BAD_REQUEST", {
                message: "Pre-validation hook failed",
                details: err instanceof Error ? err.message : String(err),
              });
            }
          }

          // Adapter validation
          if (adapter) {
            try {
              const result = await adapter.validate(ctx.body);
              if (result.error) {
                throw new APIError("BAD_REQUEST", {
                  message: "Adapter validation failed",
                  details: result.error,
                });
              }
              ctx.body = result.data;
            } catch (err) {
               throw new APIError("BAD_REQUEST", {
                message: "Adapter validation failed unexpectedly",
                details: err instanceof Error ? err.message : String(err),
               });
            }
          }

          // Schema validation
          if (schema) {
            try {
              const validatedData = await parseStandardSchema(schema, ctx.body);
              ctx.body = validatedData;
            } catch (validationError) {
              if (validationError instanceof ValidationError) {
                // Pass the actual validation issues through to the API error
                throw new APIError("BAD_REQUEST", {
                  message: "Schema validation failed",
                  details: {
                    issues: validationError.issues,
                    summary: validationError.message
                  },
                });
              } else {
                throw new APIError("BAD_REQUEST", {
                  message: "Schema validation failed unexpectedly",
                  details: validationError instanceof Error ? validationError.message : String(validationError),
                });
              }
            }
          }

          // Post-validation hook
          if (after) {
            try {
              after(ctx);
            } catch (err) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: "Post-validation hook failed",
                details: (err as Error).message,
              });
            }
          }
        } catch (error) {
          // Centralized error handling for unexpected errors
          if (error instanceof APIError) {
            // If it's already an APIError, re-throw it
            throw error;
          }
          throw new APIError("BAD_REQUEST", {
            message: "Validation failed",
            details: error instanceof Error ? error.message : String(error),
          });
        }
      }),
    })),
  };
};