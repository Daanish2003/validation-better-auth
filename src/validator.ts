import { BetterAuthPlugin, createAuthMiddleware } from 'better-auth/plugins';
import { APIError } from 'better-auth/api';

export type ValidationError = {
   field?: string,
   message: string
};

export interface ValidationAdapter {
  validate: (data: Record<string, any>) => Promise<void | ValidationError[]>;
}

interface ValidationConfig {
  path: string;
  adapter: ValidationAdapter;
}

export const validator = (configs: ValidationConfig[]): BetterAuthPlugin => {
  return {
    id: 'validator',
    middlewares: configs.map(({ path, adapter }) => ({
      path,
      middleware: createAuthMiddleware(async (ctx) => {
        try {
          await adapter.validate(ctx.body);
        } catch (errors) {
          throw new APIError('BAD_REQUEST', {
            message: 'Invalid Fields',
            issues: errors,
          });
        }
      }),
    })),
  };
};
