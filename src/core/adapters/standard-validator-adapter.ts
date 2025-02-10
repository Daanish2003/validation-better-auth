import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ValidationAdapter } from '../../types';


export const StandardAdapter: ValidationAdapter = <T extends StandardSchemaV1>(
  schema: T
) => {
  return {
    async validate(
      input: StandardSchemaV1.InferInput<T>
    ): Promise<StandardSchemaV1.InferOutput<T>> {
      let result = schema["~standard"].validate(input);
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
