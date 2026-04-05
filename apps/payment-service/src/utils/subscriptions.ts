/**
 * ============================================================
 * 📌 Used kafka
 * ============================================================
 */

import { stripeConnectAction } from "./action/connect-stripe";
import { createOrderAction } from "./action/payment-update";
import { consumer } from "./kafka";

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([
    {
      topicName: "stripe.payment",
      topicHandler: async (message) => {
        const activity = JSON.parse(message.value.toString());

        await createOrderAction({
          isPaid: activity.isPaid,
          email: activity.email,
          totalPrice: activity.totalPrice,
          shipping: activity.shipping,
          orderItems: activity.orderItems,
          payment_intent: activity.payment_intent,
        });
      },
    },
    {
      topicName: "stripe.connect",
      topicHandler: async (message) => {
        const activity = JSON.parse(message.value.toString());
        await stripeConnectAction({
          email: activity.email,
          stripeCustomerId: activity.stripeCustomerId,
        });
      },
    },
  ]);
};
