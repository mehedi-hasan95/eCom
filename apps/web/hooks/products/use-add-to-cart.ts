import {
  createAddToCartAction,
  getAddToCartAction,
} from "@/lib/actions/product-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetSession } from "../use-auth";
import { AddToCart } from "@workspace/db";
import { toast } from "sonner";

export const useAddToCartData = () => {
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: getAddToCartAction,
    staleTime: 1000 * 60 * 5,
  });
  return { data };
};

export const useAddToCartMutationData = () => {
  const { user } = useGetSession();
  const queryClient = useQueryClient();

  const mutatoin = useMutation({
    mutationFn: createAddToCartAction,
    onMutate: async (newItem) => {
      if (!user?.id) {
        return;
      }
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<AddToCart[]>(["cart"]);
      queryClient.setQueryData<AddToCart[]>(["cart"], (old = []) => {
        const existing = old.find(
          (item) => item.productId === newItem.productId,
        );
        if (existing) {
          return old.map((item) =>
            item.productId === newItem.productId
              ? { ...item, ...newItem }
              : item,
          );
        }

        return [...old, newItem as AddToCart];
      });
      return { previousCart };
    },
    onError: (err, newItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error(err.message);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (data) {
        toast.success("Product added to cart");
      }
    },
  });

  return { mutatoin };
};
