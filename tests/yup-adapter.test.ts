import { describe, it, expect } from 'vitest';
import { YupAdapter } from '../src/yup-adapter';
import * as yup from 'yup';

describe('YupAdapter', () => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  const adapter = YupAdapter(schema);

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
