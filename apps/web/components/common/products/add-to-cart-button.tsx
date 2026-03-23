"use client";

import {
  useAddToCartData,
  useAddToCartMutationData,
} from "@/hooks/products/use-add-to-cart";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface Props {
  productId: string;
  quantity?: number;
  color?: string;
  size?: string;
  usedCupon?: boolean;
  className?: string;
}
export const AddToCartButton = ({
  productId,
  color,
  quantity,
  size,
  usedCupon,
  className,
}: Props) => {
  const { mutatoin } = useAddToCartMutationData();
  const { data } = useAddToCartData();
  const isInCart = data?.find((obj) => obj.productId === productId);

  return (
    <Button
      onClick={() =>
        mutatoin.mutate({ productId, color, quantity, size, usedCupon })
      }
      className={cn("w-full flex-1", className)}
      disabled={!!isInCart?.productId}
    >
      {isInCart?.productId ? "Added to Cart" : "Add to Cart"}
    </Button>
  );
};
