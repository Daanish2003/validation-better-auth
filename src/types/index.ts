import { InputContext } from "better-auth";
import * as yup from "yup";
import { StandardSchemaV1 } from "./standard-schema";

export type ValidationConfig = {
  path: string;
  before?: (ctx: InputContext<any, any>) => void;
  schema?: StandardSchemaV1;
  adapter?: {
    validate: (input: unknown) => Promise<StandardSchemaV1.Result<unknown>>;
  };
  after?: (ctx: InputContext<any, any>) => void;
};

export type YupStandardSchema<Y extends yup.Schema<any>> = Y & {
  "~standard": {
    version: 1;
    vendor: "yup";
    validate: (value: unknown) =>
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

export type YupValidationAdapter<T extends yup.Schema<any>> = (schema: T) => {
  validate: (
    input: unknown,
  ) => Promise<StandardSchemaV1.Result<yup.InferType<T>>>;
};
