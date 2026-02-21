import { Products, WishList } from "@workspace/db";

export const createWishlistAction = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/wishlist/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};

export const getWishlistAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/wishlist/get`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const data: {
    wishlist: (WishList & {
      products: Products & {
        user: { id: string; name: string; image: string | undefined };
      };
    })[];
  } = await response.json();
  return data.wishlist;
};

export const deleteWishlistAction = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/wishlist/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
};
