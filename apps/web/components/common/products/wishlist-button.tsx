"use client";
import {
  createWishlistAction,
  deleteWishlistAction,
} from "@/lib/actions/wishlist-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WishList } from "@workspace/db";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Heart } from "lucide-react";

type Props = {
  productId: string;
  isWishlisted: boolean;
};
export const WishlistButton = ({ productId, isWishlisted }: Props) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createWishlistAction,
    onMutate: async (newWishlist) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData(["wishlist"]);
      queryClient.setQueryData(["wishlist"], (old: WishList[]) => [
        ...old,
        newWishlist,
      ]);
      return { previousWishlist };
    },

    // ❌ Rollback on error
    onError: (err, newWishlist, onMutateResult) => {
      queryClient.setQueryData(["wishlist"], onMutateResult?.previousWishlist);
      console.log(err);
    },

    // ✅ Sync with server
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteWishlistAction,

    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousWishlist = queryClient.getQueryData<WishList[]>([
        "wishlist",
      ]);
      queryClient.setQueryData<WishList[]>(["wishlist"], (old = []) =>
        old.filter((item) => item.productId !== productId),
      );
      return { previousWishlist };
    },

    onError: (err, productId, context) => {
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  return (
    <Button
      variant="outline"
      onClick={() =>
        isWishlisted
          ? deleteMutation.mutate(productId)
          : mutation.mutate(productId)
      }
    >
      <Heart
        className={cn("w-4 h-4", isWishlisted && "fill-red-500 text-red-500")}
      />
      WishList
    </Button>
  );
};
