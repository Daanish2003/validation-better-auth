import { betterAuth } from "better-auth";
import * as v from "valibot";
import { describe, it } from "vitest";
import { object, string } from "yup";
import { StandardAdapter, YupAdapter, validator } from "../index";

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
          { path: "/sign-up/email", adapter: StandardAdapter(signupSchema) },
        ]),
      ],
    });
  });

  it("initializes without errors with yup", () => {
    const signupSchema = object({
      name: string().required(),
      email: string().email(),
      password: string().required(),
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
