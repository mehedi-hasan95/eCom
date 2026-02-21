"use client";
import { ProductCard } from "@/components/common/products/product-card";
import { useWishlistData } from "@/hooks/use-wishlist";
import { Separator } from "@workspace/ui/components/separator";
import { Heart } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const { data } = useWishlistData();
  if (!data?.length) {
    return (
      <div className="container-default py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-muted-foreground">
            Add items to your wishlist to save them for later
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="container-default">
        <header className="">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 fill-destructive text-destructive" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                My Wishlist
              </h1>
              <p className="text-lg text-muted-foreground">
                {data?.length}{" "}
                {data?.length && data.length > 1 ? "items" : "item"} saved
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← Continue Shopping
            </Link>
          </div>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.map((item) => (
            <ProductCard
              key={item?.productId}
              image={item?.products?.images[0] as string}
              isTrending="Wishlist"
              price={item?.products?.salePrice}
              productId={item?.productId}
              sellerName={item?.products?.user?.name}
              title={item?.products?.title}
              sellerImage={item?.products?.user?.image}
              colors={item?.products?.color}
            />
          ))}
        </div>
      </div>
      <Separator className="my-3" />
    </>
  );
};

export default Page;
