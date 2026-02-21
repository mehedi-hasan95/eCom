import { differenceInDays } from "date-fns";

export const dayDistance = (createdAt: Date, days: number = 7) => {
  return differenceInDays(new Date(), new Date(createdAt)) <= days;
};

export const fromatPrice = (price: number) => {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
