"use client";
import Link from "next/link";
import { Author } from "./author";
import { useQuery } from "@tanstack/react-query";
import { sessionAction } from "@/lib/actions/auth-server-action";

export const AuthButton = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionAction,
  });
  return (
    <div className="flex gap-5 items-center">
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.success ? (
        <Author />
      ) : (
        <Link href={"/sign-in"}>Sign In</Link>
      )}
    </div>
  );
};
