import { RouteHandler } from "@hono/zod-openapi";
import { registrationRoute } from "./auth-routes";
import { auth } from "@workspace/auth/server";
import { prisma } from "@workspace/db";

export const registrationHandler: RouteHandler<
  typeof registrationRoute
> = async (c) => {
  const { email, name, password, role, phone } = c.req.valid("json");
  try {
    const result = await auth.api.signUpEmail({
      body: { email, name, password },
    });
    if (result.user.id) {
      await auth.api.sendVerificationOTP({
        body: { email, type: "email-verification" },
      });
    }
    return c.json(result, 200);
  } catch (err: any) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user?.emailVerified === false) {
      return c.json(
        {
          success: false,
          message: "Please verify your account. Resend the verification OTP",
          status: "not_acceptable",
        },
        406
      );
    }
    if (err?.statusCode) {
      return c.json(
        {
          success: false,
          message: err.body?.message,
          status: err.status,
        },
        err?.statusCode
      );
    }
    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500
    );
  }
};
