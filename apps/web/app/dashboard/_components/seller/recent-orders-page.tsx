"use client";

import { OrdersResponse } from "@/lib/actions/product-action";
import { ModifyPagination } from "@/components/common/modify/modify-pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { format } from "date-fns";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { fromatPrice } from "@/lib/lib";
import { Fragment } from "react";

interface Props {
  data: OrdersResponse | undefined;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  href: string;
}

export const RecentOrdersPage = ({
  data,
  page,
  setPage,
  title,
  href,
}: Props) => {
  const router = useRouter();
  const orders = data?.data || [];
  const meta = data?.meta;
  return (
    <Card className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">
          Track and manage your customer orders
        </p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Order-...{order.id.slice(-6)}
                  </CardTitle>
                  <CardDescription>{order.user.name}</CardDescription>
                </div>
              </div>
            </CardHeader>
            {order.orderItems.map((item, index) => (
              <Fragment key={item.id}>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <p className="text-sm mb-1">Product Name</p>
                      <p className="font-semibold line-clamp-1">
                        {item.product.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm mb-1">Order Date</p>
                      <p className="font-semibold">
                        {format(order.createdAt, "dd-MMM-yy")}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm mb-1">Total</p>
                      <p className="font-semibold">
                        {fromatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm mb-1">Items</p>
                      <p className="font-semibold">{item.quantity}</p>
                    </div>

                    <div>
                      <p className="text-sm mb-1">Last Update</p>
                      <p className="font-semibold">
                        {format(item.updatedAt, "dd-MMM-yy")}
                      </p>
                    </div>

                    <div className="flex justify-end md:col-span-1">
                      <Button onClick={() => router.push(`${href}/${item.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>

                {index !== order.orderItems.length - 1 && (
                  <div className="border-b my-2" />
                )}
              </Fragment>
            ))}
          </Card>
        ))}
      </div>

      {meta && (
        <ModifyPagination
          page={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          hasPrevPage={meta.hasPrevPage}
          hasNextPage={meta.hasNextPage}
        />
      )}
    </Card>
  );
};
