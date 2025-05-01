# validation-better-auth

A flexible and extensible validation plugin for the Better Auth framework. This package allows developers to validate API request using any standard schema library (e.g. Zod, Valibot, ArkType). We also support Yup by wrapping the schema internally to Standard Schema.

>Note: This package is used for type validation for api endpoint backend which used for validate the custom schema rather than normal string validation (e.g: password: John@123)

## usage using standardSchema

```ts
import { betterAuth } from "better-auth"
import { validator, StandardAdapter} from "validation-better-auth"
 
export const auth = betterAuth({
    // ... other config options
    appName: "My App", // provide your app name. It'll be used as an issuer.
    plugins: [
        validator(
      [
        {
          path: "/sign-up/email", 
          schema: SignupSchema,
          before: (ctx) => {
            console.log(ctx)
          },
          after: (ctx) => {
            console.log(ctx)
          }
        },
        {
          path: "/sign-in/email", 
          schema: SignInSchema,
          before: (ctx) => {
            console.log(ctx)
          },
          after: (ctx) => {
            console.log(ctx)
          }
        },
      ]
    ),
    ]
})
```

## usage using adapters (for non supported standardSchema)

```ts
import { betterAuth } from "better-auth"
import { validator, StandardAdapter} from "validation-better-auth"
 
export const auth = betterAuth({
    // ... other config options
    appName: "My App", // provide your app name. It'll be used as an issuer.
    plugins: [
        validator(
      [
        {
          path: "/sign-up/email", 
          adapter: YupAdapter(SignupSchema),
          before: (ctx) => {
            console.log(ctx)
          },
          after: (ctx) => {
            console.log(ctx)
          }
        },
        {
          path: "/sign-in/email", 
          adapter: YupAdapter(SignInSchema),
          before: (ctx) => {
            console.log(ctx)
          },
          after: (ctx) => {
            console.log(ctx)
          }
        },
      ]
    ),
    ]
})
```




