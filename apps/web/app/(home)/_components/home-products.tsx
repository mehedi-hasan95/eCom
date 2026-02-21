"use client";

import { ProductCard } from "@/components/common/products/product-card";
import { ProductCardLoading } from "@/components/common/products/product-card-loading";
import { getAllProductsAction } from "@/lib/actions/product-action";
import { useQuery } from "@tanstack/react-query";

export const HomeProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProductsAction(),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="container-default">
        <ProductCardLoading size={4} />
      </div>
    );
  }
  return (
    <div className="container-default">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {data?.products.map((item) => (
          <ProductCard
            key={item.id}
            productId={item.id}
            image={item.images[0] || ""}
            isTrending="Trending"
            price={item.basePrice}
            sellerName={item.user.name}
            title={item.title}
            colors={item.color}
            sellerImage={item.user.image}
          />
        ))}
      </div>
    </div>
  );
};
