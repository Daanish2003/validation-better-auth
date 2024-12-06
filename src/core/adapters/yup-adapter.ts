import * as yup from "yup";
import { ValidationAdapter, ValidationResult } from "../../types";

export const YupAdapter = (schema: yup.Schema<any>): ValidationAdapter => ({
  validate: async (data: unknown): Promise<ValidationResult> => {
    try {
      const validatedFields = await schema.validate(data, {
        abortEarly: false,
      });

      return {
        data: validatedFields, // Return validated data
      };
    } catch (error) {
      return {
        error:
          error instanceof yup.ValidationError
            ? error
            : {
                message: "Unexpected error occurred during Yup validation.",
                details: error,
              },
      };
    }
  },
});
