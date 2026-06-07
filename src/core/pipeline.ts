import { APIError } from "better-auth/api";
import { ValidationConfig } from "../types";
import { parseStandardSchema, ValidationError } from "./adapters";

export async function runValidationPipeline(
  config: ValidationConfig,
  ctx: { body: unknown },
): Promise<void> {
  const { before, after, schema, adapter } = config;

  if (before) {
    try {
      before(ctx as any);
    } catch (err) {
      throw new APIError("BAD_REQUEST", {
        message: "Pre-validation hook failed",
        details: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (adapter) {
    const result = await adapter.validate(ctx.body);
    if ("issues" in result) {
      throw new APIError("BAD_REQUEST", {
        message: "Adapter validation failed",
        details: { issues: result.issues },
      });
    }
    ctx.body = (result as { value: unknown }).value;
  }

  if (schema) {
    try {
      ctx.body = await parseStandardSchema(schema, ctx.body);
    } catch (validationError) {
      if (validationError instanceof ValidationError) {
        throw new APIError("BAD_REQUEST", {
          message: "Schema validation failed",
          details: {
            issues: validationError.issues,
            summary: validationError.message,
          },
        });
      }
      throw new APIError("BAD_REQUEST", {
        message: "Schema validation failed unexpectedly",
        details:
          validationError instanceof Error
            ? validationError.message
            : String(validationError),
      });
    }
  }

  if (after) {
    try {
      after(ctx as any);
    } catch (err) {
      throw new APIError("BAD_REQUEST", {
        message: "Post-validation hook failed",
        details: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
