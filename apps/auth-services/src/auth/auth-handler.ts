import { RouteHandler } from "@hono/zod-openapi";
import {
  registrationOtpRoute,
  registrationRoute,
  verifyRegistrationRoute,
} from "./auth-routes";
import { auth } from "@workspace/auth/server";
import { prisma } from "@workspace/db";

export const registrationHandler: RouteHandler<
  typeof registrationRoute
> = async (c) => {
  const { email, name, password, role, phone } = c.req.valid("json");
  try {
    const result = await auth.api.signUpEmail({
      body: { email, name, password, role, phone },
    });
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

export const registrationOtpHandler: RouteHandler<
  typeof registrationOtpRoute
> = async (c) => {
  const { email } = c.req.valid("json");
  try {
    const isExist = await prisma.user.findUnique({ where: { email } });
    if (isExist && isExist.emailVerified === false) {
      await auth.api.sendVerificationOTP({
        body: {
          email: email,
          type: "email-verification",
        },
      });
      return c.json(
        { success: true, message: "A verification email sent to your email" },
        201
      );
    } else if (isExist && isExist.emailVerified) {
      return c.json(
        { success: false, message: "This is a verified email" },
        409
      );
    }
    return c.json({ success: false, message: "Email not found" }, 404);
  } catch (error) {
    return c.json({ success: false, error });
  }
};

export const verifyRegistrationHandler: RouteHandler<
  typeof verifyRegistrationRoute
> = async (c) => {
  const { email, otp } = c.req.valid("json");
  try {
    const data = await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
    });
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error });
  }
};
