"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useProductFilters } from "@/hooks/nuqs/use-nuqs";
import {
  DEFAULT_LIMIT,
  sortValueType,
} from "@workspace/open-api/lib/constants";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/actions/product-action";
import { HtmlParser } from "@/components/common/html-parser";
import { AddToCartButton } from "@/components/common/products/add-to-cart-button";

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeDetails, setActiveDetails] = useState(false);

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

  const { data } = useSuspenseInfiniteQuery({
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

  // 🔥 Deduplicate products
  const products = Array.from(
    new Map(
      data.pages.flatMap((page) => page.products).map((p) => [p.id, p]),
    ).values(),
  );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleActive = () => {
    setActiveDetails((prev) => !prev);
  };

  useEffect(() => {
    if (activeDetails) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeDetails, currentIndex]);

  const getPosition = (index: number) => {
    const diff = (index - currentIndex + products.length) % products.length;

    if (diff === 0) return "item-2";
    if (diff === 1) return `item-3 ${activeDetails && "hidden"}`;
    if (diff === 2) return `item-4 ${activeDetails && "hidden"}`;
    if (diff === products.length - 1) return "item-1";
    if (diff === products.length - 2) return "item-5";

    return "hidden-item";
  };

  return (
    <div className="carousel relative overflow-hidden h-[800px]">
      <div className="list absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] max-w-[90%] h-[80%]">
        {products.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute left-0 right-0 w-[70%] h-full transition-all duration-500 ease-in-out ${getPosition(
              idx,
            )}`}
          >
            {/* IMAGE */}
            <Image
              src={item.images[0] as string}
              alt={item.title}
              width={500}
              height={500}
              className={cn(
                "absolute top-1/2 right-0 -translate-y-1/2 w-[50%] z-10 duration-500",
                activeDetails &&
                  idx === currentIndex &&
                  "right-1/2 transition-[right] duration-500",
              )}
              priority={idx === currentIndex}
            />

            {/* CONTENT */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-[400px] z-20 transition-opacity duration-500 opacity-0 pointer-events-none",
                idx === currentIndex && "opacity-100 pointer-events-auto",
                activeDetails && "hidden",
              )}
            >
              <div className="title text-2xl font-bold">{item.title}</div>
              <div className="topic text-xl">{item.categorySlug}</div>
              <div className="des">{item.shortDescription}</div>

              <button
                className="seeMore mt-4 px-4 py-2 bg-black text-white rounded cursor-pointer"
                onClick={handleActive}
              >
                See More
              </button>
            </div>

            {/* DETAILS */}
            <div
              className={cn(
                "opacity-0 pointer-events-none",
                activeDetails &&
                  "opacity-100 absolute right-0 w-1/2 text-right pointer-events-auto top-1/2 -translate-y-1/2",
              )}
            >
              <h2 className="text-2xl font-bold">{item.title}</h2>
              <HtmlParser html={item.description} />
              <AddToCartButton
                productId={item.id}
                color={item.color[0] || undefined}
                key={item.id}
                size={item.sizes[0] || undefined}
                quantity={1}
                className="w-auto"
              />
            </div>
          </div>
        ))}
      </div>

      {/* NAVIGATION */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-30 w-[1140px] max-w-[90%] justify-between">
        <CircleChevronLeft
          onClick={handlePrev}
          className={cn(
            "size-8 cursor-pointer",
            activeDetails && "opacity-0 pointer-events-none",
          )}
        />

        <button
          className={cn(
            "opacity-0 pointer-events-none",
            activeDetails && "opacity-100 pointer-events-auto cursor-pointer",
          )}
          onClick={handleActive}
        >
          Go Back
        </button>

        <CircleChevronRight
          onClick={handleNext}
          className={cn(
            "size-8 cursor-pointer",
            activeDetails && "opacity-0 pointer-events-none",
          )}
        />
      </div>
    </div>
  );
};
