import { betterAuth } from "better-auth";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import * as yup from "yup";
import { validator } from "../index";
import { YupAdapter } from "./adapters";

const BASE = "http://localhost/api/auth";

async function post(
  auth: { handler: (request: Request) => Response | Promise<Response> },
  path: string,
  body: unknown,
) {
  const res = await auth.handler(
    new Request(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

describe("validator plugin integration — schema (zod)", () => {
  const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const auth = betterAuth({
    baseURL: "http://localhost",
    plugins: [validator([{ path: "/sign-up/email", schema: signUpSchema }])],
  });

  it("returns 400 with validation issues for invalid input", async () => {
    const { status, body } = await post(auth, "/sign-up/email", {
      name: "",
      email: "not-an-email",
      password: "short",
    });

    expect(status).toBe(400);
    expect(body.message).toMatch(/Schema validation failed/i);
    expect(body.details).toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({ message: expect.any(String) }),
      ]),
    });
  });

  it("passes valid input through to better-auth (validator does not fire)", async () => {
    const { body } = await post(auth, "/sign-up/email", {
      name: "Alice",
      email: "alice@example.com",
      password: "supersecret99",
    });

    // Validator lets it through — subsequent error (if any) is from better-auth,
    // not from our validation layer.
    expect(body.message).not.toMatch(/Schema validation failed/i);
  });
});

describe("validator plugin integration — YupAdapter", () => {
  const yupSchema = yup.object({
    name: yup.string().min(1).required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  });

  const auth = betterAuth({
    baseURL: "http://localhost",
    plugins: [
      validator([{ path: "/sign-up/email", adapter: YupAdapter(yupSchema) }]),
    ],
  });

  it("returns 400 with issues for invalid input via YupAdapter", async () => {
    const { status, body } = await post(auth, "/sign-up/email", {
      name: "",
      email: "bad",
      password: "x",
    });

    expect(status).toBe(400);
    expect(body.message).toMatch(/Adapter validation failed/i);
    expect(body.details).toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({ message: expect.any(String) }),
      ]),
    });
  });

  it("passes valid input via YupAdapter through to better-auth (validator does not fire)", async () => {
    const { body } = await post(auth, "/sign-up/email", {
      name: "Bob",
      email: "bob@example.com",
      password: "supersecret99",
    });

    expect(body.message).not.toMatch(/Adapter validation failed/i);
  });
});
