import { InputContext } from "better-auth";
import { StandardSchemaV1 } from "./standard-schema";
import * as yup from 'yup';

export type ValidationConfig = {
  path: string;
  before?: (ctx: InputContext<any, any>) => void
  schema?: StandardSchemaV1
  adapter?: {
    validate: (
      input: StandardSchemaV1.InferInput<any>
    ) => Promise<StandardSchemaV1.InferOutput<any>>;
  }
  after?: (ctx: InputContext<any, any>) => void 
};

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

export type YupValidationAdapter<T extends yup.Schema<any>> = (
  schema: T
) => {
  validate: (
    input: StandardSchemaV1.InferInput<YupStandardSchema<T>>
  ) => Promise<StandardSchemaV1.InferOutput<YupStandardSchema<T>>>;
};


