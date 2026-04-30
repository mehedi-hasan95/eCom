import getQueryClient from "@/lib/query-client";
import {
  getProductDailyReport,
  getProductMonthlyReport,
  getResentOrderAction,
} from "@/lib/actions/product-action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SellerDashboardWrapper } from "./seller-dashboard-wrapper";
import { DEFAULT_LIMIT } from "@workspace/open-api/lib/constants";

export const SellerDashboardPage = async () => {
  const limit = DEFAULT_LIMIT;
  const page = 1;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users-product-monthly-report"],
    queryFn: getProductMonthlyReport,
  });
  await queryClient.prefetchQuery({
    queryKey: ["users-product-daily-report"],
    queryFn: getProductDailyReport,
  });
  await queryClient.prefetchQuery({
    queryKey: ["seller-recent-orders", limit, page],
    queryFn: () => getResentOrderAction({ limit, page }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SellerDashboardWrapper />
    </HydrationBoundary>
  );
};
