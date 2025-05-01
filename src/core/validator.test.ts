import { betterAuth } from "better-auth";
import * as v from "valibot";
import { describe, it } from "vitest";
import { validator } from "../index";
import * as yup from 'yup';
import { type } from "arktype";
import { z } from "zod"
import { YupAdapter } from "./adapters/yup-adapter";

describe("validator", () => {
  it("initializes without errors with valibot", () => {
    const signupSchema = v.object({
      name: v.string(),
      email: v.pipe(v.string(), v.email()),
      password: v.pipe(v.string(), v.minLength(12)),
    });

    betterAuth({
      plugins: [
        validator([
          { path: "/sign-up/email", schema: signupSchema },
        ]),
      ],
    });
  });

  it("initializes without errors with arktype", () => {
    const Password = type("string >= 8").configure({ actual: () => "" })
    const signupSchema = type({
      name: "string",
      email: "string.email",
      password: Password,
    });

    betterAuth({
      plugins: [
        validator([
          { path: "/sign-up/email", schema: signupSchema },
        ]),
      ],
    });
  });

  it("initializes without errors with zod", () => {
    const signupSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(12),
    });

    betterAuth({
      plugins: [
        validator([
          { path: "/sign-up/email", schema: signupSchema },
        ]),
      ],
    });
  });

  it("initializes without errors with yup", () => {
    const signupSchema = yup.object({
      name: yup.string().required(),
      email: yup.string().email(),
      password: yup.string().required(),
    });

    betterAuth({
      plugins: [
        validator([
          { path: "/sign-up/email", adapter: YupAdapter(signupSchema) },
        ]),
      ],
    });
  });
});

