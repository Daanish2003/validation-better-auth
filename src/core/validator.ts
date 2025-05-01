import { BetterAuthPlugin } from "better-auth/types";
import { createAuthMiddleware } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { ValidationConfig } from "../types/index";
import { parseStandardSchema } from "./adapters/index";

export const validator = (configs: ValidationConfig[]): BetterAuthPlugin => {
  return {
    id: "validator",
    middlewares: configs.map(({ path, schema, before, after, adapter }) => ({
      path,
      middleware: createAuthMiddleware(async (ctx) => {
        try {
          if (before) {
            try {
              before(ctx);
            } catch (err) {
              throw new APIError("BAD_REQUEST", {
                message: "Pre-validation hook failed",
                details: (err as Error).message,
              });
            }
          }

          if(adapter) {
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
          }

          if(schema) {
            try {
              const validatedData = await parseStandardSchema(schema, ctx.body)
              
              ctx.body = validatedData;
            } catch (validationError) {
              if (validationError instanceof Error) {
                try {
                  const issues = JSON.parse(validationError.message);
                  throw new APIError("BAD_REQUEST", {
                    message: "Validation failed",
                    details: {
                      issues
                    },
                  });
                } catch (parseError) {
                  throw new APIError("BAD_REQUEST", {
                    message: "Validation failed",
                    details: validationError.message,
                  });
                }
              } else {
                throw new APIError("BAD_REQUEST", {
                  message: "Validation failed",
                  details: String(validationError),
                });
              }
            }
          }

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
          throw new APIError("BAD_REQUEST", {
            message: "Validation failed",
            details: error instanceof Error ? error.message : String(error),
          });
        }
      }),
    })),
  };
};