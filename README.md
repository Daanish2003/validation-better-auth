# validation-better-auth
A flexible and extensible validation plugin for the Better Auth framework. This package allows developers to validate API request using any validation library (e.g., Zod, Yup)

## usage
```import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins"
 
export const auth = betterAuth({
    // ... other config options
    appName: "My App", // provide your app name. It'll be used as an issuer.
    plugins: [
        validator(
      [
        {path: "/sign-up/email", adapter: ZodAdapter(SignupSchema)},
        {path: "/sign-in/email", adapter: ZodAdapter(SignInSchema)},
        {path: "/two-factor/enable", adapter: ZodAdapter(PasswordSchema)},
        {path: "/two-factor/disable", adapter: ZodAdapter(PasswordSchema)},
        {path: "/two-factor/verify-otp", adapter: ZodAdapter(twoFactorSchema)},
        {path: "/forgot-password", adapter: ZodAdapter(ForgotPasswordSchema)},
      ]
    ),
    ]
})```