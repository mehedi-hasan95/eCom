import { logoutAction, sessionAction } from "@/lib/actions/auth-server-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      toast.success("Success", { description: "Logout Successfully" });
      queryClient.removeQueries({ queryKey: ["sessions"] });
      queryClient.removeQueries({ queryKey: ["wishlist"] });
      router.refresh();
    },
    onError: () => {
      toast.error("Logout failed", {
        description: "Please try again",
      });
    },
  });
  return logoutMutation;
};

export const useGetSession = () => {
  const { data } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionAction,
  });

  return { user: data?.user };
};
