import { prisma } from "@workspace/db";

export const stripeConnectAction = async (connect: {
  email: string;
  stripeCustomerId: string;
}) => {
  await prisma.user.update({
    where: { email: connect.email },
    data: { stripeCustomerId: connect.stripeCustomerId, stripeVerified: true },
  });
};
