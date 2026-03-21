"use client";

import {
  useAddToCartData,
  useAddToCartMutationData,
} from "@/hooks/products/use-add-to-cart";
import { useGetSession } from "@/hooks/use-auth";
import { createAddToCartAction } from "@/lib/actions/product-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddToCart } from "@workspace/db";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";

interface Props {
  productId: string;
  quantity?: number;
  color?: string;
  size?: string;
}
export const AddToCartButton = ({
  productId,
  color,
  quantity,
  size,
}: Props) => {
  const { mutatoin } = useAddToCartMutationData();
  const { data } = useAddToCartData();
  const isInCart = data?.find((obj) => obj.productId === productId);

  return (
    <Button
      onClick={() => mutatoin.mutate({ productId, color, quantity, size })}
      className={cn("w-full")}
      disabled={!!isInCart?.productId}
    >
      {isInCart?.productId ? "Added to Cart" : "Add to Cart"}
    </Button>
  );
};
