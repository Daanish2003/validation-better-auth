import * as yup from 'yup';
import { z } from 'zod';
import { YupAdapter } from "../src/yup-adapter";
import { ZodAdapter } from "../src/zod-adapter";
import { ValidationAdapter } from '../src/validator';
import { describe, it, expect } from "vitest";

describe('Validation Adapters', () => {
  describe('YupAdapter', () => {
    const schema = yup.object({
      email: yup.string().email('Invalid email').required('Email is required'),
      age: yup.number().min(18, 'Must be at least 18').required('Age is required'),
    });

    const adapter: ValidationAdapter = YupAdapter(schema);

    it('should validate successfully for valid data', async () => {
      const validData = { email: 'test@example.com', age: 20 };
      await expect(adapter.validate(validData)).resolves.toBeUndefined();
    });

    it('should throw validation errors for invalid data', async () => {
      const invalidData = { email: 'invalid-email', age: 16 };
      await expect(adapter.validate(invalidData)).rejects.toEqual([
        { field: 'email', message: 'Invalid email' },
        { field: 'age', message: 'Must be at least 18' },
      ]);
    });

    it('should throw validation errors for missing required fields', async () => {
      const missingData = {};
      await expect(adapter.validate(missingData)).rejects.toEqual([
        { field: 'email', message: 'Email is required' },
        { field: 'age', message: 'Age is required' },
      ]);
    });
  });

  describe('ZodAdapter', () => {
    const schema = z.object({
      email: z.string().email('Invalid email'),
      age: z.number().min(18, 'Must be at least 18'),
    });

    const adapter: ValidationAdapter = ZodAdapter(schema);

    it('should validate successfully for valid data', async () => {
      const validData = { email: 'test@example.com', age: 20 };
      await expect(adapter.validate(validData)).resolves.toBeUndefined();
    });

    it('should throw validation errors for invalid data', async () => {
      const invalidData = { email: 'invalid-email', age: 16 };
      await expect(adapter.validate(invalidData)).rejects.toEqual([
        { field: 'email', message: 'Invalid email' },
        { field: 'age', message: 'Must be at least 18' },
      ]);
    });

    it('should throw validation errors for missing required fields', async () => {
      const missingData = {};
      await expect(adapter.validate(missingData)).rejects.toEqual([
        { field: 'email', message: 'Required' },
        { field: 'age', message: 'Required' },
      ]);
    });
  });
});
