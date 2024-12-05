import * as yup from "yup";
import { ValidationAdapter } from "./validator";

export const YupAdapter = (schema: yup.Schema<any>): ValidationAdapter => ({
  validate: async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        throw err.inner.map((e) => ({
          field: e.path || undefined,
          message: e.message,
        }));
      }
      throw err;
    }
  },
});
