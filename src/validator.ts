import { BetterAuthPlugin, createAuthMiddleware } from 'better-auth/plugins';
import { APIError } from 'better-auth/api';

export interface ValidationAdapter {
  validate: (data: any) => Promise<void>;
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
