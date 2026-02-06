"use client";

import { deleteSubCategoryAction } from "@/lib/actions/admin/admin-action";
import { getSubCategoriesAction } from "@/lib/actions/category/category-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Separator } from "@workspace/ui/components/separator";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Edit2,
  MoreHorizontal,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export const SubCategoryPage = () => {
  const { data } = useQuery({
    queryKey: ["subCategories"],
    queryFn: getSubCategoriesAction,
  });
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteSubCategoryAction,
    onMutate: async (previousSubCat) => {
      await queryClient.cancelQueries({
        queryKey: ["subCategories", previousSubCat.slug],
      });
      const previousSubCategory = queryClient.getQueryData([
        "subCategories",
        previousSubCat.slug,
      ]);
      queryClient.setQueryData(
        ["subCategories", previousSubCat.slug],
        previousSubCat,
      );
      return { previousSubCategory, previousSubCat };
    },
    onError: (err, previousSubCat, onMutateResult) => {
      queryClient.setQueryData(
        ["subCategories", onMutateResult?.previousSubCat?.slug],
        onMutateResult?.previousSubCategory,
      );
    },
    onSettled: (previousSubCat) =>
      queryClient.invalidateQueries({
        queryKey: ["subCategories", previousSubCat.slug],
      }),
  });
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Sub Categories ({data?.subCategories?.length})
        </h2>
        <Link href={"/dashboard/admin/sub-categories/create-subcategory"}>
          <Button>
            <PlusCircle /> Create Sub Category
          </Button>
        </Link>
      </div>
      <Separator className="my-4" />
      <p>Explore all available sub categories and manage your content</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-5">
        {data?.subCategories?.map((category) => (
          <Card
            className="group relative overflow-hidden bg-card hover:bg-card/80 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer h-full"
            key={category.id}
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br `}
            />
            <div className="relative p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                {/* todo: add image  */}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-card border-border"
                  >
                    <Link
                      href={`/dashboard/admin/sub-categories/${category.slug}`}
                    >
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-muted text-destructive"
                      onClick={() =>
                        deleteMutation.mutate({ slug: category.slug })
                      }
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                  {category.name}
                </h3>
              </div>
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Items
                    </p>
                    <p className="text-2xl font-bold text-primary">48</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Updated
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDistanceToNow(category.updatedAt, {
                        addSuffix: true,
                        includeSeconds: true,
                      })}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full transition-all duration-200 hover:bg-primary bg-muted/50 text-white`}
                >
                  View Category
                  <ArrowRight
                    className={`w-4 h-4 ml-2 transition-transform hover:translate-x-1`}
                  />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
