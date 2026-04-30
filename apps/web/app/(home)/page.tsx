import { Suspense } from "react";
import { HeroSection } from "./_components/hero-section";
import { HomeProducts } from "./_components/home-products";
import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/hooks/nuqs/nuqs-server";
import getQueryClient from "@/lib/query-client";
import {
  DEFAULT_LIMIT,
  sortValueType,
} from "@workspace/open-api/lib/constants";
import { getAllProducts } from "@/lib/actions/product-action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  searchParams: Promise<SearchParams>;
}
export default async function Page({ searchParams }: Props) {
  const params = await loadSearchParams(searchParams);
  const queryClient = getQueryClient();

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
        limit: DEFAULT_LIMIT,
      }),
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
  });
  return (
    <div className="">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <HeroSection />
        </Suspense>
      </HydrationBoundary>
      <HomeProducts />
    </div>
  );
}
