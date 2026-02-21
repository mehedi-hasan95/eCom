"use client";
import { getCategoriesAction } from "@/lib/actions/category/category-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { CategoryPageLoading } from "./category-page-loading";
import { deleteCategoryAction } from "@/lib/actions/admin/admin-action";
import { EditDeleteCard } from "@/components/common/products/edit-delete-card";

export const CategoryPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  });

  //Delete category
  const deleteMutation = useMutation({
    mutationFn: deleteCategoryAction,
    onMutate: async (deleteCat) => {
      await queryClient.cancelQueries({
        queryKey: ["categories", deleteCat.slug],
      });
      const previousCat = queryClient.getQueryData([
        "categories",
        deleteCat.slug,
      ]);
      queryClient.setQueryData(["categories", deleteCat.slug], deleteCat);
      return { previousCat, deleteCat };
    },
    onError: (err, deleteCat, onMutateResult) => {
      queryClient.setQueryData(
        ["categories", onMutateResult?.deleteCat.slug],
        onMutateResult?.previousCat,
      );
    },
    onSettled: (deleteCat) =>
      queryClient.invalidateQueries({
        queryKey: ["categories", deleteCat.slug],
      }),
  });

  if (isLoading) {
    return <CategoryPageLoading />;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All categories</h2>
        <Link href={"/dashboard/admin/categories/create-category"}>
          <Button>Create Category</Button>
        </Link>
      </div>
      <Separator className="my-4" />
      <div className="">
        <h2 className="text-2xl font-bold">
          Categories ({data?.categories?.length})
        </h2>
        <p>Explore all available categories and manage your content</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-5">
          {data?.categories?.map((category) => (
            <EditDeleteCard
              key={category.id}
              href={`/dashboard/admin/categories/${category.slug}`}
              image={category.image || "/placeholder.png"}
              onDelete={() => deleteMutation.mutate({ slug: category.slug })}
              title={category.name}
              updateAt={formatDistanceToNow(category.updatedAt, {
                addSuffix: true,
                includeSeconds: true,
              })}
              quantity={category._count.subCategories}
            />
          ))}
        </div>
      </div>
    </>
  );
};
