"use client";
import { LoadingButton } from "@/components/common/loading-button";
import { ModifyCombobox } from "@/components/common/modify/modify-combobox";
import {
  createSubCategoryAction,
  updateSubCategoryAction,
} from "@/lib/actions/admin/admin-action";
import { getCategoriesAction } from "@/lib/actions/category/category-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubCategories } from "@workspace/db";
import { slugify } from "@workspace/open-api/lib/constants";
import { subCategorySchema } from "@workspace/open-api/schemas/admin.schamas";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props {
  initialData: SubCategories | null;
}
export const SubCategoryForm = ({ initialData }: Props) => {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  });
  const title = initialData ? "Update Sub Category" : "Create Sub Category";
  const btnLabel = initialData ? "Update" : "Create";
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const prevTitleRef = useRef("");
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof subCategorySchema>>({
    resolver: zodResolver(subCategorySchema),
    mode: "onChange",
    defaultValues: initialData || {
      name: "",
      slug: "",
      categorySlug: "",
    },
  });
  const name = form.watch("name");
  const slug = form.watch("slug");

  // Initialize slug edit state and title ref if editing
  useEffect(() => {
    if (initialData) {
      form.setValue("slug", initialData.slug);
      prevTitleRef.current = initialData.name;
      setIsSlugEdited(true);
    }
  }, [initialData, form]);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!isSlugEdited && slugify(prevTitleRef.current) === slug) {
      const newSlug = slugify(name);
      form.setValue("slug", newSlug);
      prevTitleRef.current = name;
    }
  }, [name, slug, isSlugEdited, form]);

  //create a category
  const createMutation = useMutation({
    mutationFn: createSubCategoryAction,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({
        queryKey: ["subCategories", newTodo.slug],
      });
      const previousTodo = queryClient.getQueryData([
        "subCategories",
        newTodo.slug,
      ]);
      queryClient.setQueryData(["subCategories", newTodo.slug], newTodo);

      return { previousTodo, newTodo };
    },
    onError: (err, newTodo, onMutateResult) => {
      queryClient.setQueryData(
        ["subCategories", onMutateResult?.newTodo.slug],
        onMutateResult?.previousTodo,
      );
      toast.error("Can't create subcategory. Please try again!!");
    },
    onSettled: (newTodo) => {
      queryClient.invalidateQueries({
        queryKey: ["subCategories", newTodo?.slug],
      });
      toast.success("Sub Category creted");
      router.push("/dashboard/admin/sub-categories");
    },
  });

  // update a sub category
  const updateMutation = useMutation({
    mutationFn: updateSubCategoryAction,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({
        queryKey: ["subCategories", newTodo.slug],
      });
      const previousTodo = queryClient.getQueryData([
        "subCategories",
        newTodo.slug,
      ]);
      queryClient.setQueryData(["subCategories", newTodo.slug], newTodo);

      return { previousTodo, newTodo };
    },
    onError: (err, newTodo, onMutateResult) => {
      queryClient.setQueryData(
        ["subCategories", onMutateResult?.newTodo.slug],
        onMutateResult?.previousTodo,
      );
      toast.error("Can't create subcategory. Please try again!!");
    },
    onSettled: (newTodo) => {
      queryClient.invalidateQueries({
        queryKey: ["subCategories", newTodo?.slug],
      });
      toast.success("Sub Category creted");
      router.push("/dashboard/admin/sub-categories");
    },
  });

  function onSubmit(data: z.infer<typeof subCategorySchema>) {
    if (initialData) {
      updateMutation.mutate({ ...data, id: initialData?.id });
    } else {
      createMutation.mutate(data);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="subCategory-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field orientation="horizontal">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="subCategory-form-name">
                      Sub Category Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="subCategory-form-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Apple"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="subCategory-form-slug">
                      Sub Category Slug
                    </FieldLabel>
                    <Input
                      {...field}
                      id="subCategory-form-slug"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. apple"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="categorySlug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="subCategory-form-category">
                      Select Category
                    </FieldLabel>

                    <ModifyCombobox
                      optoins={
                        data?.categories.map((cat) => ({
                          label: cat.name,
                          value: cat.slug,
                        })) ?? []
                      }
                      onChange={field.onChange}
                      value={field.value}
                      id="subCategory-form-category"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          {createMutation.isPending || updateMutation.isPending ? (
            <LoadingButton />
          ) : (
            <Button type="submit" form="subCategory-form">
              {btnLabel}
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
};
