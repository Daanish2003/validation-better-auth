import { z, ZodIssue, ZodSchema } from 'zod';
import { ValidationAdapter, ValidationError } from './validator';

export const ZodAdapter = (schema: ZodSchema): ValidationAdapter => ({
  validate: async (data) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw result.error.errors.map((e: ZodIssue) => ({
        field: e.path.join('.'),
        message: e.message,
      })) as ValidationError[];
    }
  },
});
