"use client";
import { ProductCard } from "@/components/common/products/product-card";
import { ProductsSidebar } from "./products-sidebar";
import { useProductFilters } from "@/hooks/nuqs/use-nuqs";
import { NoProduct } from "../../../components/common/products/no-product";
import { sortValueType } from "@workspace/open-api/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/actions/product-action";

export const AllProductPage = () => {
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

  console.log(maxPrice);
  const { data } = useQuery({
    queryKey: ["products", cats, sort, maxPrice, minPrice, search],
    queryFn: () => getAllProducts({ cats, sort, maxPrice, minPrice, search }),
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
  return (
    <div className="container-default flex relative">
      <div className="hidden lg:block w-1/4 bg-slate-200 dark:bg-slate-900 p-4 relative">
        <div className="sticky top-20">
          <ProductsSidebar highPrice={data?.highPrice ?? 100} />
        </div>
      </div>
      {data?.products.length ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 px-4 w-3/4">
          {data?.products?.map((item) => (
            <ProductCard
              key={item.id}
              productId={item.id}
              image={item.images[0] || ""}
              isTrending={sortLabel ?? "Test"}
              price={item.salePrice}
              basePrice={item.basePrice}
              sellerName={item.seller.name}
              title={item.title}
              colors={item.color}
              sellerImage={item.seller.image}
              id={item.id}
            />
          ))}
        </div>
      ) : (
        <NoProduct className="w-3/4" />
      )}
    </div>
  );
};
