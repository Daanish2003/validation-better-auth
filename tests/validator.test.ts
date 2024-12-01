import { describe, it, expect, vi } from 'vitest';
import { validator } from '../src/validator';

describe('Validator Plugin', () => {
  it('should return a valid BetterAuthPlugin object', () => {
    const mockAdapter = {
      validate: vi.fn(async () => Promise.resolve()),
    };

    const configs = [
      { path: '/test', adapter: mockAdapter },
    ];

    const plugin = validator(configs);

    // Ensure `middlewares` is defined before accessing it
    expect(plugin.middlewares).toBeDefined();
    expect(plugin.middlewares).toHaveLength(1);

    // Using non-null assertion (!) to inform TypeScript that `middlewares` is not null/undefined
    expect(plugin.middlewares![0].path).toBe('/test');
  });
});
