"use client";

import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import { shippingFormSchema } from "@workspace/open-api/schemas/product.schemas";
import { Button } from "@workspace/ui/components/button";
import { FormEvent, useState } from "react";
import z from "zod";

interface Props {
  shipping: z.infer<typeof shippingFormSchema>;
}
export const StripeCheckoutForm = ({ shipping }: Props) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const checkoutState = useCheckout();

  // ✅ Always call hook (no conditions here)

  if (checkoutState.type === "loading") {
    return <div>Loading...</div>;
  }

  if (checkoutState.type === "error") {
    return <div>Error: {checkoutState.error.message}</div>;
  }

  const { checkout } = checkoutState;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    await checkout.updateShippingAddress({
      name: "shipping_address",
      address: {
        country: shipping.country,
        line1: shipping.line1,
        line2: shipping.phone,
        city: shipping.city,
        postal_code: shipping.postal_code,
        state: shipping.state,
      },
    });

    const confirmResult = await checkout.confirm();

    if (confirmResult.type === "error") {
      setMessage(confirmResult.error.message);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Payment</h4>

      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      <Button
        disabled={!checkout.canConfirm || isSubmitting}
        id="submit"
        className="w-full mt-5"
      >
        {isSubmitting ? (
          <div className="spinner"></div>
        ) : (
          `Pay ${checkout.total.total.amount} now`
        )}
      </Button>

      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};
