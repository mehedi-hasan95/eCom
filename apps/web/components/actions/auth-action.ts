import {
  emailVerificationSchema,
  registrationSchema,
  verifyRegistrationEmailSchema,
} from "@workspace/open-api/schemas/auth.schemas";
import z from "zod";

export const registrationAction = async (
  data: z.input<typeof registrationSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/registration`,
    {
      method: "POST", // or 'PUT'
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
      method: "POST", // or 'PUT'
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
      method: "POST", // or 'PUT'
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
