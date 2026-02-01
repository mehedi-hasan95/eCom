import { productCreateSchema } from "@workspace/open-api/schemas/product.schemas";
import z from "zod";

export const uploadAction = async (
  data: z.input<typeof productCreateSchema>,
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach((file) => formData.append("images", file));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch("http://localhost:6002/api/v1/products/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};
