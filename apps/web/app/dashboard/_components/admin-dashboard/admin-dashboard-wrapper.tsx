"use client";

import { useQuery } from "@tanstack/react-query";
import { RevenuePage } from "../seller/revenue-page";
import {
  getAdminProductDailyReport,
  getAdminProductMonthlyReport,
  getAdminResentOrderAction,
} from "@/lib/actions/product-action";
import { useState } from "react";
import { DEFAULT_LIMIT } from "@workspace/open-api/lib/constants";
import { DailyRevenuePage } from "../seller/daily-revenup-page";
import { RecentOrdersPage } from "../seller/recent-orders-page";

export const AdminDashboardWrapper = () => {
  const { data } = useQuery({
    queryKey: ["admin-product-monthly-report"],
    queryFn: getAdminProductMonthlyReport,
  });

  const { data: dailyRevenue } = useQuery({
    queryKey: ["admin-product-daily-report"],
    queryFn: getAdminProductDailyReport,
  });

  const [page, setPage] = useState(1);
  const limit = DEFAULT_LIMIT;

  const { data: recentOrders } = useQuery({
    queryKey: ["admin-recent-orders", limit, page],
    queryFn: () => getAdminResentOrderAction({ limit, page }),
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
        href="/dashboard/admin/orders"
      />
    </div>
  );
};
