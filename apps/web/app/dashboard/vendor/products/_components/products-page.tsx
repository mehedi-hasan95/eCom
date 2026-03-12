"use client";

import { useGetSession } from "@/hooks/use-auth";
import {
  deleteProductAction,
  getAllProductsAction,
} from "@/lib/actions/product-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { ProductEditDeleteCard } from "./product-edit-delete-card";
import { toast } from "sonner";

export const ProductsPage = () => {
  const { user } = useGetSession();
  const { data } = useQuery({
    queryKey: ["all-products", user?.email],
    queryFn: () => getAllProductsAction(user?.email),
    enabled: !!user?.email,
    staleTime: 5000 * 60,
  });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteProductAction,
    onMutate: async (deleteCat) => {
      await queryClient.cancelQueries({
        queryKey: ["products", user?.email, deleteCat.sellerEmail],
      });
      const previousCat = queryClient.getQueryData([
        "products",
        user?.email,
        deleteCat.sellerEmail,
      ]);
      queryClient.setQueryData(
        ["products", user?.email, deleteCat.sellerEmail],
        deleteCat,
      );
      return { previousCat, deleteCat };
    },
    onError: (err, deleteCat, onMutateResult) => {
      queryClient.setQueryData(
        ["products", user?.email, onMutateResult?.deleteCat.sellerEmail],
        onMutateResult?.previousCat,
      );
    },
    onSettled: (deleteCat) => {
      queryClient.invalidateQueries({
        queryKey: ["products", user?.email, deleteCat.sellerEmail],
      });
      toast.success("Product delete successfully");
    },
  });
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          All Products ({data?.products?.length})
        </h2>
        <Link href={"/dashboard/vendor/products/create-product"}>
          <Button>
            <PlusCircle />
            Create Product
          </Button>
        </Link>
      </div>
      <Separator className="my-5" />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data?.products?.map((item) => (
          <ProductEditDeleteCard
            key={item.id}
            category={item.categorySlug}
            color={item.color}
            image={item.images[0] || ""}
            name={item.title}
            onEdit={`/dashboard/vendor/products/${item.id}`}
            price={item.salePrice}
            subCategory={item.subCategorySlug}
            onDelete={() =>
              deleteMutation.mutate({
                id: item.id,
                sellerEmail: user?.email as string,
              })
            }
          />
        ))}
      </div>
    </div>
  );
};
