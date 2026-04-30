import { OrderStatusBadge } from "@/components/common/orders/order-status-badge";
import { OrderTimeline } from "@/components/common/orders/order-timeline";
import { OrderStatus } from "@/lib/@types/db-types";
import { fromatPrice } from "@/lib/lib";
import { Order, OrderItems } from "@workspace/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { format } from "date-fns";
import Image from "next/image";

interface Props {
  data: OrderItems & {
    order: Order;
    product: { title: string; images: string[] };
  };
}
export const OrderDetailsPage = ({ data }: Props) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Order-{data?.id.slice(-6)}
              </CardTitle>
              {data?.createdAt && (
                <CardDescription>
                  Placed on {format(data?.createdAt as Date, "MMMM dd, yyyy")}
                </CardDescription>
              )}
            </div>
            <OrderStatusBadge
              status={(data?.status as OrderStatus) || OrderStatus.PROCESSING}
            />
          </div>
        </CardHeader>
        <CardContent>
          <OrderTimeline currentStatus={data?.status as OrderStatus} />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">{data?.order?.phone}</p>
            <p className="font-semibold">{data?.order?.line1}</p>
            <p>
              {data?.order?.city}, {data?.order?.state}{" "}
              {data?.order?.postal_code}
            </p>
            <p>{data?.order?.country}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{fromatPrice(data?.price * data?.quantity)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b last:border-b-0">
              <div className="flex flex-col">
                <p className="font-semibold">{data?.product?.title}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {data?.quantity}
                </p>
              </div>
              <Image
                src={data.product.images[0] as string}
                alt={data.product.title}
                height={100}
                width={100}
              />
              <p className="font-semibold">{fromatPrice(data?.price)}</p>
            </div>
            <div className="flex justify-between pt-4 border-t font-bold text-lg">
              <span>Total</span>
              <span>{fromatPrice(data?.price * data?.quantity)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
