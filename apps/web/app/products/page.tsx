import getQueryClient from "@/lib/query-client";
import { priceRangeAction } from "@/lib/actions/product-action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Suspense } from "react";
import { AllProductPage } from "./_components/all-product-page";

const Page = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["price-range"],
    queryFn: priceRangeAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<>Loading...</>}>
        <AllProductPage />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
