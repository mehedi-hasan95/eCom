import { categorySchema } from "@workspace/open-api/schemas/admin.schamas";
import z from "zod";

export const createCategoryAction = async (
  data: z.input<typeof categorySchema>,
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "image" && value instanceof File) {
      formData.append("image", value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/create-category`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};

export const updateCategoryAction = async (
  data: z.input<typeof categorySchema>,
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "image" && value instanceof File) {
      formData.append("image", value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/update-category`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};

export const deleteCategoryAction = async (data: { slug: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/delete-category/category`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};
