import {
  emailVerificationSchema,
  loginSchema,
  registrationSchema,
  resetPasswordSchema,
  verifyRegistrationEmailSchema,
} from "@workspace/open-api/schemas/auth.schemas";
import z from "zod";

export const registrationAction = async (
  data: z.input<typeof registrationSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/registration`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

export const emailVerificaionAction = async (
  data: z.input<typeof emailVerificationSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/send-verification-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

export const emailVerificaionOTPAction = async (
  data: z.input<typeof verifyRegistrationEmailSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/verify-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

export const loginAction = async (data: z.input<typeof loginSchema>) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

export const forgetPasswordEmailAction = async (
  data: z.input<typeof emailVerificationSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/forget-password-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

export const forgetPasswordEmailOtpAction = async (
  data: z.input<typeof verifyRegistrationEmailSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/forget-password-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

export const resetPasswordAction = async (
  data: z.input<typeof resetPasswordSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};
