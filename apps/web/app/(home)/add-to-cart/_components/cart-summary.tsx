"use client";

import { fromatPrice } from "@/lib/lib";
import { AddToCart } from "@workspace/db";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface Props {
  data:
    | (AddToCart & {
        product: { title: string; images: string[]; salePrice: number };
      })[]
    | [];
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
}
export const CartSummary = ({ data, setStep }: Props) => {
  const totalPrice = data.reduce((total, item) => {
    return (
      total +
      (item.usedCupon
        ? item.product.salePrice * item.quantity * 0.9
        : item.product.salePrice * item.quantity)
    );
  }, 0);
  const totalQuantity = data.length;
  return (
    <Card className="sticky top-12">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              Subtotal ({totalQuantity} {totalQuantity > 1 ? "items" : "item"} )
            </span>
            <span>{fromatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{fromatPrice(totalPrice)}</span>
          </div>
        </div>
        <Button className="w-full" size="lg" onClick={() => setStep(2)}>
          Proceed to Checkout
        </Button>
      </CardContent>
    </Card>
  );
};
