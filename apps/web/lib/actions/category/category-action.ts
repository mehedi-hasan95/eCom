import { Category, SubCategories } from "@workspace/db";

export const getCategoriesAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/categories`,
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: { categories: Category[] } = await response.json();
  return { categories: data.categories };
};

export const getCategoryAction = async (category: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/categories/category`,
  );

  url.searchParams.set("category", category);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};

export const getSubCategoriesAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/categories/categories/sub-categories`,
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: { subCategories: SubCategories[] } = await response.json();
  return { subCategories: data.subCategories };
};

export const getSubCategoryAction = async (slug: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/categories/categories/sub-category`,
  );

  url.searchParams.set("slug", slug);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw await response.json();
  }

  const data: { subCategory: SubCategories } = await response.json();
  return { subcategory: data.subCategory };
};
