import { AddToCart, Order, OrderItems, Products } from "@workspace/db";
import { sortValueType } from "@workspace/open-api/lib/constants";
import { shortUser } from "@workspace/open-api/schemas/other.schema";
import {
  addToCartSchema,
  deleteProductSchema,
  productCreateSchema,
  updateProductSchema,
} from "@workspace/open-api/schemas/product.schemas";
import z from "zod";
import { OrderStatus } from "../@types/db-types";

export const productCreateAction = async (
  data: z.input<typeof productCreateSchema>,
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach((file) => formData.append("images", file));
    } else if (key === "previousImage" && Array.isArray(value)) {
      value.forEach((img) => formData.append("previousImage", img));
    } else if (key === "tags" && Array.isArray(value)) {
      value.forEach((tag) => formData.append("tags", tag));
    } else if (key === "color" && Array.isArray(value)) {
      value.forEach((c) => formData.append("color", c));
    } else if (key === "sizes" && Array.isArray(value)) {
      value.forEach((c) => formData.append("sizes", c));
    } else if (key === "specification" && Array.isArray(value)) {
      formData.append("specification", JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch("http://localhost:6002/api/v1/products/create", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};

export const getAllProductsAction = async (userEmail?: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/all-products`,
  );

  if (userEmail) {
    url.searchParams.set("userEmail", userEmail);
  }
  const response = await fetch(url.toString(), {
    method: "GET",
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: {
    products: (Products & {
      user: { id: string; image: string; name: string };
    })[];
  } = await response.json();
  return { products: data.products };
};

export const getSingleProductAction = async (id: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/single-product`,
  );

  if (id) {
    url.searchParams.set("id", id);
  }
  const response = await fetch(url.toString(), {
    method: "GET",
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: {
    product: Products & {
      user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        stripeCustomerId: string;
      };
      productAnalyses: { productSale: number };
    };
    rating: { _avg: { ratings: number | null }; _count: { _all: number } };
  } = await response.json();
  return data;
};
//update product

export const productUpdateAction = async (
  data: z.input<typeof updateProductSchema>,
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach((file) => formData.append("images", file));
    } else if (key === "previousImage" && Array.isArray(value)) {
      value.forEach((img) => formData.append("previousImage", img));
    } else if (key === "tags" && Array.isArray(value)) {
      value.forEach((tag) => formData.append("tags", tag));
    } else if (key === "color" && Array.isArray(value)) {
      value.forEach((c) => formData.append("color", c));
    } else if (key === "sizes" && Array.isArray(value)) {
      value.forEach((c) => formData.append("sizes", c));
    } else if (key === "specification" && Array.isArray(value)) {
      formData.append("specification", JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/update`,
    {
      method: "PATCH",
      body: formData,
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};

export const deleteProductAction = async (
  data: z.input<typeof deleteProductSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/delete`,
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
    const error = await response.json();
    throw error;
  }
  return response.json();
};

type GetProductsParams = {
  cats?: string[];
  sort?: sortValueType;
  maxPrice?: number;
  minPrice?: number;
  sellerEmail?: string;
  search?: string;

  // pagination
  cursor?: string | null;
  limit?: number;
};

export const getAllProducts = async (params: GetProductsParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : String(value),
      );
    }
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/all-product?${searchParams.toString()}`,
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: {
    products: (Products & {
      user: z.infer<typeof shortUser>;
    })[];
    nextCursor: any;
  } = await response.json();
  return data;
};

export const priceRangeAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/price-range`,
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: { minPrice: number; maxPrice: number } = await response.json();
  return data;
};

export const createAddToCartAction = async (
  data: z.input<typeof addToCartSchema>,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/create-add-to-cart`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const cart = await response.json();
  return cart;
};

export const getAddToCartAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/add-to-cart`,
    { credentials: "include" },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: {
    cart: (AddToCart & {
      product: { title: string; images: string[]; salePrice: number };
    })[];
  } = await response.json();
  return data.cart;
};

export const removeACartAction = async (productId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/remove-a-cart`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

export const removeAllCartAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/remove-all-cart`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

export const getProductMonthlyReport = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/reports/get-monthly-report`,
    {
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: {
    data: { total_sales: number; total_quantity: number; month: Date }[];
  } = await response.json();
  return data.data;
};

export const getProductDailyReport = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/reports/get-report`,
    {
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: {
    data: { total_sales: number; total_quantity: number; date: string }[];
  } = await response.json();
  return data.data;
};

export type OrdersResponse = {
  data: (Order & {
    orderItems: (OrderItems & {
      product: { title: string; images: string[] };
    })[];
    user: { name: string };
  })[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
export const getResentOrderAction = async (data: {
  limit: number;
  page: number;
}) => {
  const params = new URLSearchParams({
    limit: String(data.limit),
    page: String(data.page),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/reports/get-resent-order?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const result: OrdersResponse = await response.json();
  return result;
};

export const getSellerSingleOrderAction = async (data: { id: string }) => {
  const params = new URLSearchParams({
    id: String(data.id),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/reports/get-seller-single-order?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const result: {
    data: OrderItems & {
      order: Order;
      product: { title: string; images: string[] };
    };
  } = await response.json();
  return result.data;
};

export const updateSellerSingleOrderAction = async (data: {
  id: string;
  status: OrderStatus;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/reports/update-seller-single-order`,
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
    const error = await response.json();
    throw error;
  }
  return response.json();
};

/**
 * ============================================================
 * 📌 API: Product's report for admin
 * ============================================================
 */

export const getAdminProductMonthlyReport = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/reports/get-admin-monthly-report`,
    {
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: {
    data: { total_sales: number; total_quantity: number; month: Date }[];
  } = await response.json();
  return data.data;
};

//

export const getAdminProductDailyReport = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/reports/get-admin-report`,
    {
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: {
    data: { total_sales: number; total_quantity: number; date: string }[];
  } = await response.json();
  return data.data;
};

export const getAdminResentOrderAction = async (data: {
  limit: number;
  page: number;
}) => {
  const params = new URLSearchParams({
    limit: String(data.limit),
    page: String(data.page),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/reports/get-admin-resent-order?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const result: OrdersResponse = await response.json();
  return result;
};

export const getAdminSingleOrderAction = async (data: { id: string }) => {
  const params = new URLSearchParams({
    id: String(data.id),
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/reports/get-admin-single-order?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const result: {
    data: OrderItems & {
      order: Order;
      product: { title: string; images: string[] };
    };
  } = await response.json();
  return result.data;
};
