// /**
//  * ============================================================
//  * 📌 Used kafka
//  * ============================================================
//  */

// import { consumer } from "./kafka";
// import { trackProductActivity } from "./action/product-analysis";

// export const runKafkaSubscriptions = async () => {
//   consumer.subscribe([
//     {
//       topicName: "product.activity",
//       topicHandler: async (message) => {
//         const activity = JSON.parse(message.value.toString());
//         console.log(activity);
//         await trackProductActivity({
//           id: activity.id,
//           action: activity.action,
//           cartQty: activity.cartQty,
//         });
//       },
//     },
//   ]);
// };
