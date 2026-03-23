"use client";

import { useState, useEffect, useRef } from "react";
import {
  useAddToCartData,
  useAddToCartMutationData,
} from "@/hooks/products/use-add-to-cart";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartSummary } from "./cart-summary";
import { fromatPrice } from "@/lib/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  removeACartAction,
  removeAllCartAction,
} from "@/lib/actions/product-action";
import { AddToCart } from "@workspace/db";

export const AddToCartPage = () => {
  const { data } = useAddToCartData();
  const { mutatoin } = useAddToCartMutationData();

  // Local state for instant UI feedback
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >({});
  const timerRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Sync local state with server data on load
  useEffect(() => {
    if (data) {
      const initialQtys: Record<string, number> = {};
      data.forEach((item) => {
        initialQtys[item.productId] = item.quantity;
      });
      setLocalQuantities(initialQtys);
    }
  }, [data]);

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const currentQty = localQuantities[productId] || 0;
    const newQty = currentQty + delta;

    // --- LIMITS ---
    // Prevent going below 1 or above 10
    if (newQty < 1 || newQty > 10) return;

    // 1. Update UI instantly
    setLocalQuantities((prev) => ({
      ...prev,
      [productId]: newQty,
    }));

    // 2. Debounce DB call per product
    if (timerRef.current[productId]) {
      clearTimeout(timerRef.current[productId]);
    }

    timerRef.current[productId] = setTimeout(() => {
      mutatoin.mutate({ productId, quantity: newQty });
    }, 400);
  };

  const queryClient = useQueryClient();
  const removeACartMutation = useMutation({
    mutationFn: removeACartAction,
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<AddToCart[]>(["cart"]);

      // Optimistically remove item
      queryClient.setQueryData(["cart"], (old: AddToCart[] = []) =>
        old.filter((item) => item.productId !== productId),
      );

      return { previousCart };
    },

    // ❌ 2. Rollback if error
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },

    // 🔄 3. Refetch to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeAllCartMutation = useMutation({
    mutationFn: removeAllCartAction,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<AddToCart[]>(["cart"]);

      // ✅ Clear entire cart optimistically
      queryClient.setQueryData(["cart"], []);

      return { previousCart };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Shopping
          </Link>
          <h1 className="text-4xl font-bold mt-4">Shopping Cart</h1>
        </div>

        {!data || data.length === 0 ? (
          <Card className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <Link href="/">
              <Button className="mt-4">Continue Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {data.map((item) => {
                const displayQuantity =
                  localQuantities[item.productId] ?? item.quantity;

                return (
                  <Card key={item.id}>
                    <CardContent className="p-6 flex gap-6">
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item?.product?.images[0] as string}
                          alt={item?.product?.title}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">
                            {item?.product?.title}
                          </h3>
                          <p className="font-bold">
                            {fromatPrice(
                              displayQuantity * item?.product?.salePrice,
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border rounded-lg bg-card">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.productId, -1)
                              }
                              className="p-2 hover:bg-muted disabled:opacity-30 cursor-pointer"
                              disabled={displayQuantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <span className="px-4 font-medium min-w-[40px] text-center">
                              {displayQuantity}
                            </span>

                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.productId, 1)
                              }
                              className="p-2 hover:bg-muted disabled:opacity-30 cursor-pointer"
                              disabled={displayQuantity >= 10}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {displayQuantity >= 10 && (
                            <span className="text-xs text-orange-500 font-medium">
                              Max limit reached
                            </span>
                          )}

                          <button
                            className="ml-auto p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors cursor-pointer"
                            onClick={() =>
                              removeACartMutation.mutate(item.productId)
                            }
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              <div className="mt-8">
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => removeAllCartMutation.mutate()}
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CartSummary data={data} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
