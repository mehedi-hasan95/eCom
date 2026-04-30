"use client";

import { NotFound } from "@/components/common/not-found";
import { getAdminSingleOrderAction } from "@/lib/actions/product-action";
import { useQuery } from "@tanstack/react-query";
import { OrderDetailsPage } from "@/components/common/orders/order-details-page";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface Props {
  id: string;
}

export const AdminSingleOrderPage = ({ id }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-single-order", id],
    queryFn: () => getAdminSingleOrderAction({ id }),
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
    </div>
  );
};
