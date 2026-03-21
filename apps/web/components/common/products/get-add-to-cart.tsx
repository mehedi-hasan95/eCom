"use client";

import { useAddToCartData } from "@/hooks/products/use-add-to-cart";
import { cn } from "@workspace/ui/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export const GetAddToCart = () => {
  const { data } = useAddToCartData();
  return (
    <Link href={"/add-to-cart"} className="relative">
      <ShoppingCart className={cn("size-5")} />
      <span className="absolute -right-2 -top-4">{data?.length}</span>
    </Link>
  );
};
