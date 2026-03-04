import { consumer } from "./kafka";

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([
    {
      topicName: "wishlist.created",
      topicHandler: async (message) => {
        const wishlist = JSON.parse(message.value.toString());

        console.log("Received message: wishlist.created", wishlist);
      },
    },
  ]);
};
