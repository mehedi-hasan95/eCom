import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/hooks/nuqs/nuqs-server";
import getQueryClient from "@/lib/query-client";
import { getAllProducts } from "@/lib/actions/product-action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { sortValueType } from "@workspace/open-api/lib/constants";
import { Suspense } from "react";
import { AllProductPage } from "./_components/all-product-page";

interface Props {
  searchParams: Promise<SearchParams>;
}
const Page = async ({ searchParams }: Props) => {
  const params = await loadSearchParams(searchParams);
  const cats =
    typeof params.cats === "string"
      ? (params.cats as string).split(",")
      : Array.isArray(params.cats)
        ? params.cats
        : undefined;
  const sort = params.sort as sortValueType | undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const search = params.search ?? "";
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products", cats, sort, maxPrice, minPrice, search],
    queryFn: ({ pageParam }) =>
      getAllProducts({
        cats,
        sort,
        maxPrice,
        minPrice,
        search,
        cursor: pageParam,
        limit: 10,
      }),
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
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
