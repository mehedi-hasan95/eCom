import { prisma } from "@workspace/db";

export const trackProductActivity = async (activity: {
  id: string;
  action: "view-product" | "wishlist" | "cart";
  cartQty?: number;
}) => {
  let views = 0;
  let wishlist = 0;
  let cart = 0;

  if (activity.action === "view-product") {
    views = 1;
  }

  if (activity.action === "wishlist") {
    views = 1;
    wishlist = 1;
  }

  if (activity.action === "cart") {
    views = 1;
    cart = activity.cartQty ?? 1;
  }

  await prisma.productAnalysis.upsert({
    where: { productId: activity.id },
    update: {
      productViews: { increment: views },
      addWishlist: { increment: wishlist },
      addCart: { increment: cart },
    },
    create: {
      productId: activity.id,
      productViews: views,
      addWishlist: wishlist,
      addCart: cart,
      productSale: 0,
    },
  });
};
