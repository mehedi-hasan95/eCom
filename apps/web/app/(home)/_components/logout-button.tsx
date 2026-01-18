"use client";

import { logoutAction } from "@/lib/actions/auth-server-action";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  className?: string;
}
export const LogoutButton = ({ className }: Props) => {
  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      toast.success("Success", { description: "Logout Successfully" });
      router.refresh();
    },
    onError: () => {
      toast.error("Logout failed", {
        description: "Please try again",
      });
    },
  });
  return (
    <button
      type="button"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className={cn("cursor-pointer", className)}
    >
      {logoutMutation.isPending ? "Log out..." : "Log Out"}
    </button>
  );
};
