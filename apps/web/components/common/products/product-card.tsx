"use client";
import { fromatPrice } from "@/lib/lib";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Eye } from "lucide-react";
import Image from "next/image";
import { WishlistButton } from "./wishlist-button";
import { useWishlistData } from "@/hooks/products/use-wishlist";
import Link from "next/link";
import { useState } from "react";
import { AddToCartButton } from "./add-to-cart-button";

interface Props {
  image: string;
  sellerName: string;
  sellerImage?: string;
  title: string;
  price: number;
  basePrice: number;
  colors?: string[];
  sizes?: string[];
  isTrending: string;
  productId: string;
  id: string;
}
export const ProductCard = ({
  image,
  sellerName,
  sellerImage,
  title,
  price,
  basePrice,
  colors,
  isTrending,
  productId,
  sizes,
  id,
}: Props) => {
  const { data } = useWishlistData();
  const isWishlisted = data?.find((obj) => obj.productId === productId);
  const [selectedColor, setSelectedColor] = useState(
    colors ? colors[0] : undefined,
  );
  const [selectedSize, setSelectedSize] = useState(
    sizes ? sizes[sizes.length - 1] : undefined,
  );

  return (
    <div className="relative border p-1 dark:border-none dark:p-0 group">
      <div className="relative">
        <div
          className={cn(
            "w-[60%] px-5 py-2 dark:bg-indigo-950 rounded-t-3xl flex items-center gap-3 before:content-[''] before:absolute before:bg-transparent before:h-full before:top-0 before:right-0 before:w-[40%] before:rounded-bl-[30px] before:shadow-[-5px_10px_0_#fff] dark:border-none dark:before:shadow-[-5px_10px_0_#000] ",
          )}
        >
          <Image
            src={sellerImage ?? "/logo.png"}
            alt=""
            height={35}
            width={35}
            className="flex-0"
          />
          <div className="flex-1">
            <p>{sellerName}</p> <span>Subscribe</span>
          </div>
        </div>
        <div className="right-0 top-0 absolute rounded-full border-2 dark:border-none flex justify-center items-center dark:bg-indigo-950 w-[calc(40%-10px)] h-full font-bold">
          {isTrending}
        </div>
      </div>
      <div className="dark:bg-indigo-950 rounded-b-3xl rounded-tr-3xl px-5">
        <div className="relative">
          {image && (
            <Image
              src={image}
              alt=""
              height={500}
              width={500}
              className="aspect-video pt-5"
            />
          )}
          {/**
           * ============================================================
           * 📌 Absolute position start
           * ============================================================
           */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <WishlistButton
              productId={productId}
              isWishlisted={isWishlisted?.productId ? true : false}
            />
            <Link href={`products/${id}`}>
              <Button size="sm" variant="outline" className="gap-2 ">
                <Eye className="w-4 h-4" />
                View Product
              </Button>
            </Link>
          </div>
          {/**
           * ============================================================
           * 📌 Absolute position start
           * ============================================================
           */}
        </div>
        <div className="py-4 space-y-3 ">
          <div className="space-y-3">
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
                {title}
              </h2>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <h4 className="font-extrabold text-xl">{fromatPrice(price)}</h4>
              <h4 className="line-through text-muted-foreground">
                {fromatPrice(basePrice)}
              </h4>
            </div>
            <div className="space-y-2">
              {colors?.length ? (
                <div className="flex flex-col items-center">
                  <p>Color</p>
                  <div className="flex gap-2">
                    {colors.map((item) => (
                      <button
                        key={item}
                        onClick={() => setSelectedColor(item)}
                        className={cn(
                          "w-6 h-6 rounded-full border cursor-pointer",
                          selectedColor === item && "border-red-600",
                        )}
                        style={{ backgroundColor: item }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {sizes?.length ? (
                <div className="flex flex-col items-center">
                  <p>Color</p>
                  <div className="flex gap-2">
                    {sizes.map((item) => (
                      <button
                        key={item}
                        onClick={() => setSelectedSize(item)}
                        className={cn(
                          "w-6 h-6 rounded-full border cursor-pointer",
                          selectedSize === item && "border-red-600",
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <AddToCartButton
            productId={productId}
            color={selectedColor}
            size={selectedSize}
            quantity={1}
          />
        </div>
      </div>
    </div>
  );
};
