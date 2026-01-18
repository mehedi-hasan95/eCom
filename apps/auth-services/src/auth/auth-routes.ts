import { createRoute, z } from "@hono/zod-openapi";
import {
  emailVerificationSchema,
  loginSchema,
  registrationSchema,
  resetPasswordSchema,
  verifyRegistrationEmailSchema,
} from "@workspace/open-api/schemas/auth.schemas";

const tags = ["Authentication"];
export const registrationRoute = createRoute({
  method: "post",
  path: "/registration",
  tags,
  description: "Register your account",
  summary: "Registration",
  request: {
    body: {
      content: {
        "application/json": {
          schema: registrationSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: registrationSchema,
        },
      },
      description: "Register your account",
    },
    406: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(false),
            status: z.number().default(406),
          }),
        },
      },
      description: "This email have an account. Please try another email",
    },
    500: {
      description: "Something went wrong",
    },
  },
});

export const registrationOtpRoute = createRoute({
  method: "post",
  path: "/send-verification-otp",
  tags,
  description: "Verify the user's email address by sending OTP",
  summary: "Verification Email",
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ email: z.email() }) },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string().default("Please check your email"),
            status: z.number().default(201),
          }),
        },
      },
      description: "Send OTP",
    },
    404: {
      description: "Email not found",
    },
    500: {
      description: "Internal server error",
    },
  },
});

export const verifyRegistrationRoute = createRoute({
  method: "post",
  path: "verify-email",
  summary: "Verify Email with OTP",
  description: "Verify email with OTP",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: verifyRegistrationEmailSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: verifyRegistrationEmailSchema,
        },
      },
      description: "Verify your email with OTP",
    },
    500: {
      description: "Internal server error",
    },
  },
});

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags,
  summary: "Login",
  description: "Login using email or password",
  request: {
    body: { content: { "application/json": { schema: loginSchema } } },
  },
  responses: {
    201: {
      content: {
        "application/json": { schema: loginSchema },
      },
      description: "Login API",
    },
    500: {
      description: "Internal server error",
    },
  },
});

export const logoutRoute = createRoute({
  method: "post",
  path: "/logout",
  tags,
  summary: "Logout",
  description: "Logout you account",
  responses: {
    200: {
      description: "Logged out successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(false),
            error: z.string(),
          }),
        },
      },
    },
  },
});

export const sessionRoute = createRoute({
  method: "get",
  path: "/session",
  tags,
  summary: "User session data",
  description:
    "Check ether user login or not. Provide user's cookies session. Please provide the cookie data by own",
  responses: {
    200: {
      description: "Authenticated session",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

export const forgetPasswordEmailRoute = createRoute({
  method: "post",
  path: "/forget-password-email",
  tags,
  summary: "Forget password email",
  description:
    "To reset the user's password with OTP, you need to verify you email first",
  request: {
    body: {
      description: "Forget password email",
      content: { "application/json": { schema: emailVerificationSchema } },
    },
  },
  responses: {
    200: {
      description: "Forget password email",
      content: {
        "application/json": { schema: z.object({ success: z.boolean() }) },
      },
    },
    404: {
      description: "Email not found",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean().default(false) }),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean().default(false) }),
        },
      },
    },
  },
});

export const forgetPasswordVerifyRoute = createRoute({
  method: "post",
  path: "/forget-password-otp",
  tags,
  summary: "Forget password email verify with OTP",
  description:
    "Once user reset their password provide their email, then verify the email with OTP",
  request: {
    body: {
      content: {
        "application/json": { schema: verifyRegistrationEmailSchema },
      },
    },
  },
  responses: {
    200: {
      description: "OTP match",
      content: {
        "application/json": { schema: z.object({ success: z.boolean() }) },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean().default(false) }),
        },
      },
    },
  },
});

export const resetPasswordRoute = createRoute({
  method: "post",
  path: "/reset-password",
  tags,
  summary: "Reset password",
  description:
    "After verify user email with OTP now time to reset user's password",
  request: {
    body: {
      content: {
        "application/json": {
          schema: resetPasswordSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "OTP match",
      content: {
        "application/json": { schema: z.object({ success: z.boolean() }) },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean().default(false) }),
        },
      },
    },
  },
});
