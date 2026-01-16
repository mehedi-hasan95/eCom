import { prisma } from "@workspace/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: "http://localhost:6001",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 64,
    requireEmailVerification: true,
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          // todo: add email to send email
          console.log(otp);
        }
      },
      disableSignUp: false,
    }),
  ],
  trustedOrigins: ["http://localhost:3000", "http://localhost:6001"],
});
