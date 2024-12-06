import { z, ZodIssue, ZodSchema } from "zod";
import { ValidationAdapter, ValidationError } from "../types";

export const ZodAdapter = (schema: ZodSchema): ValidationAdapter => ({
  validate: async (data: Record<string, unknown>) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw result.error.errors.map((e: ZodIssue) => ({
        field: e.path.join("."),
        message: e.message,
      }));
    }
  },
  formatError: (errors: ValidationError[]) => 
    errors.map((error) => ({ field: error.field, message: error.message}))
});
