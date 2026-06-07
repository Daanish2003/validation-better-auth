import { describe, expect, it } from "vitest";
import * as yup from "yup";
import { z } from "zod";
import { parseStandardSchema, ValidationError, YupAdapter } from ".";

const zodSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

const yupSchema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().min(1).required(),
});

describe("parseStandardSchema", () => {
  it("resolves to the validated value for valid input", async () => {
    const result = await parseStandardSchema(zodSchema, {
      email: "user@example.com",
      name: "Alice",
    });
    expect(result).toEqual({ email: "user@example.com", name: "Alice" });
  });

  it("throws ValidationError with issues for invalid input", async () => {
    await expect(
      parseStandardSchema(zodSchema, { email: "not-an-email", name: "" }),
    ).rejects.toBeInstanceOf(ValidationError);

    try {
      await parseStandardSchema(zodSchema, { email: "not-an-email", name: "" });
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).issues.length).toBeGreaterThan(0);
      expect((err as ValidationError).issues[0]).toHaveProperty("message");
    }
  });
});

describe("YupAdapter", () => {
  it("resolves {value} for valid input", async () => {
    const adapter = YupAdapter(yupSchema);
    const result = await adapter.validate({
      email: "user@example.com",
      name: "Alice",
    });
    expect(result).toEqual({
      value: { email: "user@example.com", name: "Alice" },
    });
  });

  it("resolves {issues} for invalid input instead of rejecting", async () => {
    const adapter = YupAdapter(yupSchema);
    const result = await adapter.validate({ email: "not-an-email", name: "" });
    expect(result).toHaveProperty("issues");
    expect((result as { issues: unknown[] }).issues.length).toBeGreaterThan(0);
    expect(
      (result as { issues: Array<{ message: string }> }).issues[0],
    ).toHaveProperty("message");
  });
});
