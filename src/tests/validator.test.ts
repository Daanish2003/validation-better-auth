import { describe, it, expect } from "vitest";
import { z } from "zod";
import * as yup from "yup";
import { YupAdapter, ZodAdapter } from "../adapters";

describe("Validator Plugin", () => {
  const zodSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    age: z.number().min(18, "Age must be 18 or above"),
  });
  const yupSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .required(),
    age: yup.number().min(18, "Age must be 18 or above").required(),
  });

  const zodAdapter = ZodAdapter(zodSchema);
  const yupAdapter = YupAdapter(yupSchema);

  it("should validate data with ZodAdapter", async () => {
    const validData = { username: "JohnDoe", age: 25 };
    const invalidData = { username: "JD", age: 15 };

    await expect(zodAdapter.validate(validData)).resolves.not.toThrow();
    await expect(zodAdapter.validate(invalidData)).rejects.toEqual([
      { field: "username", message: "Username must be at least 3 characters" },
      { field: "age", message: "Age must be 18 or above" },
    ]);
  });

  it("should validate data with YupAdapter", async () => {
    const validData = { username: "JohnDoe", age: 25 };
    const invalidData = { username: "JD", age: 15 };

    await expect(yupAdapter.validate(validData)).resolves.not.toThrow();
    await expect(yupAdapter.validate(invalidData)).rejects.toEqual([
      { field: "username", message: "Username must be at least 3 characters" },
      { field: "age", message: "Age must be 18 or above" },
    ]);
  });
});
