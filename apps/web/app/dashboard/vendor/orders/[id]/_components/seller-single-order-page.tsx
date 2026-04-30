"use client";

import { NotFound } from "@/components/common/not-found";
import { getSellerSingleOrderAction } from "@/lib/actions/product-action";
import { useQuery } from "@tanstack/react-query";
import { OrderDetailsPage } from "@/components/common/orders/order-details-page";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { UpdateSingleOrderPage } from "./update-single-order-page";
import { OrderStatus } from "@/lib/@types/db-types";

interface Props {
  id: string;
}

export const SellerSingleOrderPage = ({ id }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["seller-single-order", id],
    queryFn: () => getSellerSingleOrderAction({ id }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-60 w-full" />
        <div className="md:flex gap-5">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }
  if (!data) {
    return (
      <NotFound
        title="Product not found"
        description="You can try another way"
        showMenu={false}
      />
    );
  }
  return (
    <div className="space-y-4">
      <OrderDetailsPage data={data} />
      <UpdateSingleOrderPage
        id={data.id}
        currentStatus={data.status as OrderStatus}
      />
    </div>
  );
};
