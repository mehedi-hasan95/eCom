"use server";

import { User } from "@workspace/db";
import { cookies, headers } from "next/headers";

export const sessionAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/session`,
    {
      headers: {
        cookie: (await headers()).get("cookie") ?? "",
      },
    },
  );
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return {
    success: true,
    user: data.user as User,
    session: data.session,
  };
};

export const logoutAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`,
    {
      method: "POST",
      headers: {
        cookie: (await headers()).get("cookie") ?? "",
      },
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error("Logout failed");
  }
  (await cookies()).delete("better-auth.session_token");
  return { success: true };
};
