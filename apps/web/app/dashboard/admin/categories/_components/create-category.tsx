"use client";

import { ImageUploader } from "@/app/dashboard/vendor/products/[id]/_components/image-uploader";
import { LoadingButton } from "@/components/common/loading-button";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/admin/admin-action";
import getQueryClient from "@/lib/query-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Category } from "@workspace/db";
import { slugify } from "@workspace/open-api/lib/constants";
import { categorySchema } from "@workspace/open-api/schemas/admin.schamas";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props {
  initialData: Category | null;
}

export const CreateCategory = ({ initialData }: Props) => {
  type UpdateCategorySchema = z.infer<typeof categorySchema> & {
    id: string;
  };

  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const prevTitleRef = useRef("");
  const queryClient = getQueryClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      image: undefined,
      previousImage: initialData?.image || undefined,
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

  const createMutation = useMutation({
    mutationFn: createCategoryAction,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({
        queryKey: ["categories", newTodo.slug],
      });
      const previousTodo = queryClient.getQueryData([
        "categories",
        newTodo.slug,
      ]);
      queryClient.setQueryData(["categories", newTodo.slug], newTodo);

      return { previousTodo, newTodo };
    },
    onError: (err, newTodo, onMutateResult) => {
      queryClient.setQueryData(
        ["categories", onMutateResult?.newTodo.slug],
        onMutateResult?.previousTodo,
      );
      toast.error("Can't create subcategory. Please try again!!");
    },
    onSettled: (newTodo) => {
      queryClient.invalidateQueries({
        queryKey: ["categories", newTodo?.slug],
      });
      toast.success("Category creted");
      router.push("/dashboard/admin/categories");
    },

    // onError: (error) => {
    //   toast.error(error.message);
    // },
    // onSuccess: (data) => {
    //   toast.success(data.message);
    //   queryClient.invalidateQueries({ queryKey: ["categories"] });
    //   router.push("/dashboard/admin/categories");
    // },
  });

  // update category
  const updateMutation = useMutation({
    mutationFn: updateCategoryAction,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({
        queryKey: ["categories", newTodo.slug],
      });
      const previousTodo = queryClient.getQueryData([
        "categories",
        newTodo.slug,
      ]);
      queryClient.setQueryData(["categories", newTodo.slug], newTodo);

      return { previousTodo, newTodo };
    },
    onError: (err, newTodo, onMutateResult) => {
      queryClient.setQueryData(
        ["categories", onMutateResult?.newTodo.slug],
        onMutateResult?.previousTodo,
      );
      toast.error("Can't create subcategory. Please try again!!");
    },
    onSettled: (newTodo) => {
      queryClient.invalidateQueries({
        queryKey: ["categories", newTodo?.slug],
      });
      toast.success("Category Updated");
      router.push("/dashboard/admin/categories");
    },
  });

  function onSubmit(data: z.infer<typeof categorySchema>) {
    if (initialData) {
      updateMutation.mutate({
        ...data,
        id: initialData.id,
      } as UpdateCategorySchema);
    } else {
      createMutation.mutate(data);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="category-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field orientation="horizontal">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="category-form-name">
                      Category Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="category-form-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Mobile"
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
                    <FieldLabel htmlFor="category-form-slug">
                      Category Slug
                    </FieldLabel>
                    <Input
                      {...field}
                      id="category-form-slug"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. mobile"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </Field>
            {initialData?.image && form.watch("previousImage") && (
              <Controller
                name="previousImage"
                control={form.control}
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="category-form-slug">
                      Previous Image
                    </FieldLabel>
                    <div className="relative max-w-[300px]">
                      <Image
                        src={initialData.image || ""}
                        alt=""
                        height={300}
                        width={300}
                      />
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          form.setValue("previousImage", undefined);
                        }}
                        className="absolute right-2 top-2"
                      >
                        X
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="category-form-image">
                    Category Image
                  </FieldLabel>
                  <ImageUploader
                    maxFiles={1}
                    disabled={form.formState.isSubmitting}
                    value={field.value ? [field.value] : []}
                    onChange={(files) => field.onChange(files?.[0])}
                    onBlur={field.onBlur}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
            <Button type="submit" form="category-form">
              Submit
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
};
