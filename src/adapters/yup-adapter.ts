import * as yup from "yup";
import { ValidationAdapter } from "../types";

export const YupAdapter = (schema: yup.Schema<unknown>): ValidationAdapter => ({
  validate: async (data: Record<string, unknown>) => {
    try {
      await schema.validate(data, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        throw err.inner.map((error) => ({
          field: error.path || undefined,
          message: error.message,
        }));
      }
      throw err;
    }
  },
  formatError: (errors) => errors.map((e) => ({
    field: e.field, message: e.message
  }))
});
