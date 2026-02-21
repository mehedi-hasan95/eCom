"use client";

import { useWishlistData } from "@/hooks/use-wishlist";
import { cn } from "@workspace/ui/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";

export const WishlistCount = () => {
  const { data } = useWishlistData();
  return (
    <Link href={"/wishlist"} className="relative">
      <Heart
        className={cn("size-5", data?.length && "fill-red-500 text-red-500")}
      />
      <span className="absolute -right-2 -top-4">{data?.length}</span>
    </Link>
  );
};
