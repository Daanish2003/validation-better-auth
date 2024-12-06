import { BetterAuthPlugin, createAuthMiddleware } from 'better-auth/plugins';
import { APIError } from 'better-auth/api';
import { ValidationErrorClass } from './errors/validation-error';
import { ValidationAdapter, ValidationConfig } from './types';


export const validator = (configs: ValidationConfig[]): BetterAuthPlugin => {
  const middlewareCache = new Map<ValidationAdapter, ReturnType<typeof createAuthMiddleware>>();

  return {
    id: 'validator',
    middlewares: configs.map(({ path, adapter }) => {
      if (!middlewareCache.has(adapter)) {
        middlewareCache.set(
          adapter,
          createAuthMiddleware(async (ctx) => {
            try {
              // Validate the request body
              const result = adapter.validate(ctx.body as Record<string, unknown>);
              if (result instanceof Promise) {
                await result;
              } else if (result) {
                throw new ValidationErrorClass(result);
              }
            } catch (err) {
              if (err instanceof ValidationErrorClass) {
                // Format and throw a structured API error
                const formattedError = adapter.formatError
                  ? adapter.formatError(err.issues)
                  : err.issues;

                throw new APIError('BAD_REQUEST', {
                  message: 'Invalid Fields',
                  issues: formattedError,
                });
              }
              throw err; // Re-throw unexpected errors
            }
          })
        );
      }

      return {
        path,
        middleware: middlewareCache.get(adapter)!,
      };
    }),
  };
};
