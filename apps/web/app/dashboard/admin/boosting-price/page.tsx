import getQueryClient from "@/lib/query-client";
import { BoostinPricePage } from "./_components/boosting-price-page";
import { getAllBoostingCoinAction } from "@/lib/actions/admin/admin-action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["boosting-coin"],
    queryFn: getAllBoostingCoinAction,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoostinPricePage />
    </HydrationBoundary>
  );
};

export default Page;
