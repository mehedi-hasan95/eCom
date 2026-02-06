import {
  categorySchema,
  subCategorySchema,
} from "@workspace/open-api/schemas/admin.schamas";
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

export const createSubCategoryAction = async (
  data: z.input<typeof subCategorySchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/category/create-subcategory`,
    {
      method: "POST",
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

export const deleteSubCategoryAction = async (data: { slug: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/category/delete-subcategory`,
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

export const subCategoryWithIdSchema = subCategorySchema.extend({
  id: z.string(), // or z.number(), z.uuid(), etc.
});
export const updateSubCategoryAction = async (
  data: z.input<typeof subCategoryWithIdSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/admin/category/update-subcategory`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};
