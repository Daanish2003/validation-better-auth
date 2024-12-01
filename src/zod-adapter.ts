import { z, ZodSchema } from 'zod';
import { ValidationAdapter } from './validator';

export const ZodAdapter = (schema: ZodSchema): ValidationAdapter => ({
  validate: async (data) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw result.error.errors;
    }
  },
});
