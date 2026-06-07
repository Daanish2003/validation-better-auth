import { APIError } from "better-auth/api";
import { describe, expect, it, vi } from "vitest";
import * as yup from "yup";
import { z } from "zod";
import { YupAdapter } from "./adapters";
import { runValidationPipeline } from "./pipeline";

const schema = z.object({
  name: z.string().min(1),
  age: z.coerce.number().min(0),
});

const yupSchema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().min(1).required(),
});

describe("runValidationPipeline", () => {
  it("sets ctx.body to the validated output for valid schema input", async () => {
    const ctx = { body: { name: "Alice", age: "30" } };
    await runValidationPipeline({ path: "/test", schema }, ctx);
    expect(ctx.body).toEqual({ name: "Alice", age: 30 });
  });

  it("throws BAD_REQUEST APIError with issues for invalid schema input", async () => {
    const ctx = { body: { name: "", age: -1 } };
    await expect(
      runValidationPipeline({ path: "/test", schema }, ctx),
    ).rejects.toMatchObject({
      status: "BAD_REQUEST",
      body: { message: "Schema validation failed" },
    });

    try {
      await runValidationPipeline({ path: "/test", schema }, ctx);
    } catch (err) {
      expect(err).toBeInstanceOf(APIError);
      expect((err as APIError).body).toMatchObject({
        message: "Schema validation failed",
        details: expect.objectContaining({ issues: expect.any(Array) }),
      });
    }
  });

  it("sets ctx.body to the validated value from adapter", async () => {
    const ctx = { body: { email: "user@example.com", name: "Alice" } };
    const adapter = YupAdapter(yupSchema);
    await runValidationPipeline({ path: "/test", adapter }, ctx);
    expect(ctx.body).toEqual({ email: "user@example.com", name: "Alice" });
  });

  it("throws BAD_REQUEST for invalid adapter input", async () => {
    const ctx = { body: { email: "not-an-email", name: "" } };
    const adapter = YupAdapter(yupSchema);
    await expect(
      runValidationPipeline({ path: "/test", adapter }, ctx),
    ).rejects.toMatchObject({
      status: "BAD_REQUEST",
      body: { message: "Adapter validation failed" },
    });
  });

  it("throws BAD_REQUEST when before hook throws", async () => {
    const ctx = { body: {} };
    const before = vi.fn().mockImplementation(() => {
      throw new Error("hook error");
    });
    await expect(
      runValidationPipeline({ path: "/test", schema, before }, ctx),
    ).rejects.toMatchObject({
      status: "BAD_REQUEST",
      body: { message: "Pre-validation hook failed" },
    });
  });

  it("throws BAD_REQUEST (not INTERNAL_SERVER_ERROR) when after hook throws", async () => {
    const ctx = { body: { name: "Alice", age: 30 } };
    const after = vi.fn().mockImplementation(() => {
      throw new Error("after error");
    });
    await expect(
      runValidationPipeline({ path: "/test", schema, after }, ctx),
    ).rejects.toMatchObject({
      status: "BAD_REQUEST",
      body: { message: "Post-validation hook failed" },
    });
  });
});
