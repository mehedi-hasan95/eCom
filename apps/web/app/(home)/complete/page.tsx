import { Button } from "@workspace/ui/components/button";
import {
  ArrowRight,
  CheckCircle,
  Download,
  Mail,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { OrderSuccess } from "./_compnents/order-success-page";
import { fromatPrice } from "@/lib/lib";

interface Props {
  searchParams: Promise<{ session_id: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { session_id } = await searchParams;
  if (!session_id) {
    return <div>No session id found!</div>;
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_URL}/stripe/${session_id}`,
  );
  const data = await res.json();
  const totalPrice = data.products.data.reduce(
    (acc: number, item: any) => acc + item.amount_total,
    0,
  );
  return (
    <div className="container-default min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">
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

              {/* Order Summary */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Package className="w-6 h-6 text-muted-foreground" />
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg">
                      <thead className="">
                        <tr>
                          <th className="px-4 py-2 text-center text-sm font-semibold text-muted-foreground border-b">
                            Name
                          </th>
                          <th className="px-4 py-2 text-center text-sm font-semibold text-muted-foreground border-b">
                            Quantity
                          </th>
                          <th className="px-4 py-2 text-center text-sm font-semibold text-muted-foreground border-b">
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.products.data.map((item: any) => (
                          <tr className="" key={item.id}>
                            <td className="px-4 py-2 border-b">
                              {item.description}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {fromatPrice(item.amount_total / 100)}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-2 font-bold text-right"
                          >
                            Total
                          </td>
                          <td className="px-4 py-2 font-bold border-t">
                            {fromatPrice(totalPrice / 100)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex gap-5 mt-5 justify-center">
                  <Link href="/dashboard">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
