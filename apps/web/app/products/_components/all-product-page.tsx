"use client";
import { ProductCard } from "@/components/common/products/product-card";
import { ProductsSidebar } from "./products-sidebar";
import { useProductFilters } from "@/hooks/nuqs/use-nuqs";
import { NoProduct } from "../../../components/common/products/no-product";
import {
  DEFAULT_LIMIT,
  sortValueType,
} from "@workspace/open-api/lib/constants";
import { useQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts, priceRangeAction } from "@/lib/actions/product-action";
import { InfinityScroll } from "@/components/common/products/infinity-scroll";

interface Props {
  isManual?: boolean;
}
export const AllProductPage = ({ isManual = false }: Props) => {
  const [filters] = useProductFilters();
  const cats =
    typeof filters.cats === "string"
      ? (filters.cats as string).split(",")
      : Array.isArray(filters.cats)
        ? filters.cats
        : undefined;
  const sort = filters.sort as sortValueType | undefined;
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined;
  const minPrice = filters.minPrice ? Number(filters.minPrice) : undefined;
  const search = filters.search ?? "";

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
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
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      staleTime: 1000 * 60 * 5,
    });

  let sortLabel = "trending";
  if (filters.sort === "trending") {
    sortLabel = "🔥 Trending";
  } else if (filters.sort === "new") {
    sortLabel = "🆕 New";
  } else if (filters.sort === "popular") {
    sortLabel = "🚀 Popular";
  } else {
    sortLabel = "👌 Classic";
  }

  // 🔥 Deduplicate products
  const products = Array.from(
    new Map(
      data.pages.flatMap((page) => page.products).map((p) => [p.id, p]),
    ).values(),
  );

  const { data: price } = useQuery({
    queryKey: ["price-range"],
    queryFn: priceRangeAction,
  });
  return (
    <div className="container-default flex relative">
      <div className="hidden lg:block w-1/4 bg-slate-200 dark:bg-slate-900 p-4 relative">
        <div className="sticky top-20">
          <ProductsSidebar highPrice={price?.maxPrice ?? 100} />
        </div>
      </div>

      <div className="w-3/4">
        {products.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 px-4">
              {products.map((item) => (
                <ProductCard
                  key={item.id}
                  productId={item.id}
                  image={item.images[0] || ""}
                  isTrending={sortLabel ?? "Trending"}
                  price={item.salePrice}
                  basePrice={item.basePrice}
                  sellerName={"mehedi"}
                  title={item.title}
                  colors={item.color}
                  sellerImage={item.user.image}
                  id={item.id}
                />
              ))}
            </div>
            <InfinityScroll
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              finishText="No More"
              isManual={isManual}
            />
          </>
        ) : (
          <NoProduct />
        )}
      </div>
    </div>
  );
};
