"use server";

import { User, userRole } from "@workspace/db";
import { cookies, headers } from "next/headers";

//
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

export const getUserDetailsAction = async () => {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore).toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/user-details`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const data: {
    data: {
      email: string;
      id: string;
      name: string;
      role: userRole;
      phone: string | null;
      stripeVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
      emailVerified: boolean;
      image: string | null;
    } | null;
  } = await response.json();
  return data.data;
};
