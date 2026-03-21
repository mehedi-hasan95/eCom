"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Link from "next/link";

export const CartSummary = () => {
  return (
    <Card className="sticky top-12">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            {/* <span>Subtotal ({itemCount} items)</span> */}
            <span>Subtotal (10 items)</span>
            {/* <span>${total.toFixed(2)}</span> */}
            <span>$50</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            {/* <span>${total.toFixed(2)}</span> */}
            <span>$70</span>
          </div>
        </div>
        <Link href="/checkout">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
