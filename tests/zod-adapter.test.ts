import { describe, it, expect } from 'vitest';
import { ZodAdapter } from '../src/zod-adapter';
import { z } from 'zod';

describe('ZodAdapter', () => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const adapter = ZodAdapter(schema);

  it('should validate correct data', async () => {
    const validData = {
      email: 'test@example.com',
      password: 'securepassword',
    };

    await expect(adapter.validate(validData)).resolves.toBeUndefined();
  });

  it('should throw errors for invalid data', async () => {
    const invalidData = { email: 'not-an-email', password: 'short' };

    await expect(adapter.validate(invalidData)).rejects.toBeInstanceOf(Array);
  });
});
