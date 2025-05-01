import * as yup from "yup";
import type { YupValidationAdapter, YupStandardSchema } from "../../types";
import { StandardSchemaV1 } from "../../types/standard-schema";


function standardizeYup<Schema extends yup.Schema>(
  yupSchema: Schema,
  vendor = 'validator-better-auth'
): StandardSchemaV1<YupStandardSchema<Schema>> {
  return {
    '~standard': {
      version: 1,
      vendor,
      async validate(value: unknown) {
        try {
          const validatedValue = await yupSchema.validate(value);
          return { value: validatedValue };
        } catch (err: any) {
          const issues =
            err.inner && err.inner.length > 0
              ? err.inner.map((issue: yup.ValidationError) => ({
                  message: issue.message,
                  path: issue.path != null ? [issue.path] : undefined,
                }))
              : [
                  {
                    message: err.message || 'Validation failed',
                    path: err.path != null ? [err.path] : undefined,
                  },
                ];

          return { issues };
        }
      },
      types: {
        input: (null as unknown) as StandardSchemaV1.InferInput<YupStandardSchema<Schema>>,
        output: (null as unknown) as StandardSchemaV1.InferOutput<YupStandardSchema<Schema>>,
      },
    },
  };
}


export const YupAdapter: YupValidationAdapter<yup.Schema<any>> = <T extends yup.Schema<any>>(
  schema: T
) => {
  const mappedSchema = standardizeYup(schema);

  return {
    async validate(
      input: StandardSchemaV1.InferInput<YupStandardSchema<T>>
    ): Promise<StandardSchemaV1.InferOutput<YupStandardSchema<T>>> {
      let result = mappedSchema["~standard"].validate(input);
      if (result instanceof Promise) result = await result;
      if ("issues" in result) {
        return Promise.reject(
          new Error(JSON.stringify(result.issues, null, 2))
        );
      }
      return result.value;
    },
  };
};