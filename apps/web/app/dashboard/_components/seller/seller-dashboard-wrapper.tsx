"use client";

import { RevenuePage } from "./revenue-page";
import { DailyRevenuePage } from "./daily-revenup-page";
import { useQuery } from "@tanstack/react-query";
import {
  getProductDailyReport,
  getProductMonthlyReport,
  getResentOrderAction,
} from "@/lib/actions/product-action";
import { RecentOrdersPage } from "./recent-orders-page";
import { useState } from "react";
import { DEFAULT_LIMIT } from "@workspace/open-api/lib/constants";

export const SellerDashboardWrapper = () => {
  const { data } = useQuery({
    queryKey: ["users-product-monthly-report"],
    queryFn: getProductMonthlyReport,
  });
  const { data: dailyRevenue } = useQuery({
    queryKey: ["users-product-daily-report"],
    queryFn: getProductDailyReport,
  });

  const [page, setPage] = useState(1);
  const limit = DEFAULT_LIMIT;

  const { data: recentOrders } = useQuery({
    queryKey: ["seller-recent-orders", limit, page],
    queryFn: () => getResentOrderAction({ limit, page }),
    placeholderData: (previousData) => previousData, // Keeps UI stable while fetching new page
  });

  return (
    <div className="space-y-4">
      <RevenuePage data={data} />
      <DailyRevenuePage data={dailyRevenue} />
      <RecentOrdersPage
        data={recentOrders}
        page={page}
        setPage={setPage}
        title="Recent Orders"
        href="/dashboard/vendor/orders"
      />
    </div>
  );
};
