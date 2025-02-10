import * as yup from "yup";
import type { StandardSchemaV1 } from '@standard-schema/spec';


// Only required until following PR is completed: https://github.com/jquense/yup/pull/2258
export type YupStandardSchema<Y extends yup.Schema<any>> = Y & {
  '~standard': {
    version: 1;
    vendor: 'yup';
    validate: (
      value: unknown
    ) =>
      | { value: yup.InferType<Y> }
      | {
          issues: ReadonlyArray<{
            message: string;
            path?: ReadonlyArray<PropertyKey>;
          }>;
        };
    types: {
      input: yup.Asserts<Y>;
      output: yup.InferType<Y>;
    };
  };
};


export type ValidationAdapter = (<T extends StandardSchemaV1>(
  schema: T
) => {
  validate: (
    input: StandardSchemaV1.InferInput<T>
  ) => Promise<StandardSchemaV1.InferOutput<T>>;
}) | (<T extends yup.Schema<any>>(
  schema: T
) => {
  validate: (
    input: StandardSchemaV1.InferInput<YupStandardSchema<T>>
  ) => Promise<StandardSchemaV1.InferOutput<YupStandardSchema<T>>>;
});


export type ValidationConfig = {
  path: string;
  adapter: {
    validate: (
      input: StandardSchemaV1.InferInput<any>
    ) => Promise<StandardSchemaV1.InferOutput<any>>;
  };
};