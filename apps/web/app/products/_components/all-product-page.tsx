"use client";
import { ProductCard } from "@/components/common/products/product-card";
import { ProductCardLoading } from "@/components/common/products/product-card-loading";
import {
  getAllProducts,
  getAllProductsAction,
} from "@/lib/actions/product-action";
import { useQuery } from "@tanstack/react-query";
import { ProductsSidebar } from "./products-sidebar";
import { useSearchParams } from "next/navigation";
import { sortValueType } from "@workspace/open-api/lib/constants";

export const AllProductPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProductsAction(),
    staleTime: 1000 * 60 * 5,
  });

  const searchParams = useSearchParams();

  // read params
  const catsParam = searchParams.get("cats");
  const sortParam = searchParams.get("sort");
  const maxPriceParam = searchParams.get("maxPrice");

  // convert
  const cats = catsParam ? catsParam.split(",") : undefined;
  const sort = sortParam as sortValueType | undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  const { data: fuck } = useQuery({
    queryKey: ["products", cats, sort, maxPrice],
    queryFn: () =>
      getAllProducts({
        cats,
        sort,
        maxPrice,
      }),
  });
  console.log(fuck);
  if (isLoading) {
    return (
      <div className="container-default">
        <ProductCardLoading size={4} />
      </div>
    );
  }
  return (
    <div className="container-default flex relative">
      <div className="hidden lg:block w-1/4 bg-slate-900 p-4 relative">
        <div className="sticky top-20">
          <ProductsSidebar />
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 px-4 w-3/4">
        {data?.products?.map((item) => (
          <ProductCard
            key={item.id}
            productId={item.id}
            image={item.images[0] || ""}
            isTrending="Trending"
            price={item.salePrice}
            basePrice={item.basePrice}
            sellerName={item.user.name}
            title={item.title}
            colors={item.color}
            sellerImage={item.user.image}
            id={item.id}
          />
        ))}
      </div>
    </div>
  );
};
