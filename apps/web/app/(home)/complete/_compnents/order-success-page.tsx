"use client";

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Download,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface Vendor {
  id: string;
  name: string;
  items: number;
  estimatedDelivery: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const OrderSuccess = () => {
  const [copied, setCopied] = useState(false);

  // Mock data - replace with actual order data
  const orderId =
    "ORD-2024-" + Math.random().toString(36).substring(7).toUpperCase();
  const orderTotal = 299.99;
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const vendors: Vendor[] = [
    {
      id: "vendor-1",
      name: "TechStore Plus",
      items: 2,
      estimatedDelivery: "5-7 business days",
    },
    {
      id: "vendor-2",
      name: "Fashion Hub",
      items: 1,
      estimatedDelivery: "3-5 business days",
    },
  ];

  const items: OrderItem[] = [
    {
      id: "item-1",
      name: "Wireless Headphones",
      price: 129.99,
      quantity: 1,
      image: "/api/placeholder/60/60",
    },
    {
      id: "item-2",
      name: "Phone Case Pack",
      price: 39.99,
      quantity: 2,
      image: "/api/placeholder/60/60",
    },
    {
      id: "item-3",
      name: "Premium Leather Jacket",
      price: 90.01,
      quantity: 1,
      image: "/api/placeholder/60/60",
    },
  ];

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container-default min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              {/* Animated success icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="w-20 h-20 text-accent fill-accent" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 text-balance">
                Order Confirmed!
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Thank you for your purchase. Your order has been received and is
                being prepared for shipment.
              </p>

              {/* Order ID */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <p className="text-sm text-muted-foreground mb-2">
                  Order Number
                </p>
                <div className="flex items-center justify-between gap-4">
                  <code className="text-2xl font-mono font-bold text-primary">
                    {orderId}
                  </code>
                  <button
                    onClick={copyOrderId}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Summary */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Package className="w-6 h-6 text-secondary" />
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 pb-4 border-b border-border last:border-0"
                    >
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="font-semibold text-primary mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border space-y-2">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>${orderTotal}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className="text-accent font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-foreground bg-accent/10 rounded-lg p-3">
                    <span>Total</span>
                    <span className="text-accent">${orderTotal}</span>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Truck className="w-6 h-6 text-secondary" />
                  Shipping From Vendors
                </h2>

                <div className="space-y-4">
                  {vendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="bg-muted/50 rounded-lg p-4 border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {vendor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {vendor.items}{" "}
                            {vendor.items === 1 ? "item" : "items"} in this
                            shipment
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Expected delivery:{" "}
                        <span className="text-foreground font-semibold">
                          {vendor.estimatedDelivery}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-secondary" />
                  What&apos;s Next?
                </h2>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Confirmation Email
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check your email for order confirmation and vendor
                        details.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Track Your Order
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Visit your account to track shipments from each vendor.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Receive & Enjoy
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Items will arrive from different vendors. Check each
                        package upon delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {/* Account Button */}
                <Link href="/account">
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-lg flex items-center justify-center gap-2">
                    Go to My Account
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-primary text-primary hover:bg-primary/10 text-base font-semibold rounded-lg"
                  >
                    Continue Shopping
                  </Button>
                </Link>

                {/* Download Invoice */}
                <button className="w-full h-12 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2 text-foreground font-semibold">
                  <Download className="w-5 h-5" />
                  Download Invoice
                </button>

                {/* Info Box */}
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check your email for tracking links from each vendor.
                  </p>
                  <Link
                    href="/support"
                    className="text-accent hover:text-accent/80 font-semibold text-sm flex items-center gap-2"
                  >
                    Contact Support
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
