import { prisma } from "@workspace/db";

type orderItem = {
  productId: string;
  color: string | undefined;
  size: string | undefined;
  usedCupon: boolean;
  quantity: number;
  price: number;
};
type shipping = {
  line1: string | null;
  postal_code: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  country: string;
};

export const createOrderAction = async (order: {
  totalPrice: number;
  email: string;
  isPaid: boolean;
  shipping: shipping;
  orderItems: orderItem[];
  payment_intent: string;
}) => {
  try {
    await prisma.order.create({
      data: {
        ...order.shipping,
        totalPrice: order.totalPrice / 100,
        isPaid: order.isPaid,
        email: order.email,
        payment_intent: order.payment_intent,
        orderItems: {
          create: order.orderItems.map((item) => ({
            productId: item.productId,
            price: item.price / 100,
            color: item.color,
            size: item.size,
            usedCupon: item.usedCupon,
            quantity: item.quantity,
          })),
        },
      },
    });
  } catch (error) {
    console.log("Fuck you!!!", error);
  }
};
