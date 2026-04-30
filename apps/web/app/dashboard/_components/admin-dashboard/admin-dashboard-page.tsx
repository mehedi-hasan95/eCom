import { DEFAULT_LIMIT } from "@workspace/open-api/lib/constants";
import { AdminDashboardWrapper } from "./admin-dashboard-wrapper";
import getQueryClient from "@/lib/query-client";
import {
  getAdminProductDailyReport,
  getAdminProductMonthlyReport,
  getAdminResentOrderAction,
} from "@/lib/actions/product-action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const AdminDashboardPage = async () => {
  const limit = DEFAULT_LIMIT;
  const page = 1;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admin-product-monthly-report"],
    queryFn: getAdminProductMonthlyReport,
  });
  await queryClient.prefetchQuery({
    queryKey: ["admin-product-daily-report"],
    queryFn: getAdminProductDailyReport,
  });
  await queryClient.prefetchQuery({
    queryKey: ["admin-recent-orders", limit, page],
    queryFn: () => getAdminResentOrderAction({ limit, page }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardWrapper />
    </HydrationBoundary>
  );
};
