"use client";
import { getResentOrderAction } from "@/lib/actions/product-action";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@workspace/open-api/lib/constants";
import { useState } from "react";
import { RecentOrdersPage } from "../../_components/seller/recent-orders-page";

const Page = () => {
  const [page, setPage] = useState(1);
  const limit = DEFAULT_LIMIT;

  const { data: recentOrders } = useQuery({
    queryKey: ["seller-recent-orders", limit, page],
    queryFn: () => getResentOrderAction({ limit, page }),
    placeholderData: (previousData) => previousData, // Keeps UI stable while fetching new page
  });
  return (
    <RecentOrdersPage
      data={recentOrders}
      page={page}
      setPage={setPage}
      title="Your recent orders"
      href="/dashboard/vendor/orders"
    />
  );
};

export default Page;
