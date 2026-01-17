import { prisma } from "@workspace/db";
import redis from "@workspace/redis";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
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
    nextCookies(),
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      partitioned: false,
    },
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
          partitioned: false,
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "SELLER"],
        required: false,
        defaultValue: "USER",
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: undefined,
      },
    },
  },
  secondaryStorage: {
    get: async (key) => {
      return await redis.get(key);
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, value, "EX", ttl);
      } else {
        await redis.set(key, value);
      }
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:6001"],
});
