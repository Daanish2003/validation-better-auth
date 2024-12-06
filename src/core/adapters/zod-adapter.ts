import { ZodError, ZodSchema } from "zod";
import { ValidationAdapter, ValidationResult } from "../../types";

export const ZodAdapter = (schema: ZodSchema): ValidationAdapter => ({
  validate: async (data: unknown): Promise<ValidationResult> => {
    try {
      const validatedFields = schema.safeParse(data);

      if (!validatedFields.success) {
        return {
          error: validatedFields.error as ZodError,
        };
      }
      return {
        data: validatedFields.data,
      };
    } catch (error) {
      return {
        error: {
          message: "Unexpected error occurred during Zod validation.",
          details: error,
        },
      };
    }
  },
});
