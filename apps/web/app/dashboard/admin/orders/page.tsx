"use client";
import { getAdminResentOrderAction } from "@/lib/actions/product-action";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@workspace/open-api/lib/constants";
import { useState } from "react";
import { RecentOrdersPage } from "../../_components/seller/recent-orders-page";

const Page = () => {
  const [page, setPage] = useState(1);
  const limit = DEFAULT_LIMIT;

  const { data: recentOrders } = useQuery({
    queryKey: ["admin-recent-orders", limit, page],
    queryFn: () => getAdminResentOrderAction({ limit, page }),
    placeholderData: (previousData) => previousData,
  });
  return (
    <RecentOrdersPage
      data={recentOrders}
      page={page}
      setPage={setPage}
      title="Recent Order Admin view"
      href="/dashboard/admin/orders"
    />
  );
};

export default Page;
