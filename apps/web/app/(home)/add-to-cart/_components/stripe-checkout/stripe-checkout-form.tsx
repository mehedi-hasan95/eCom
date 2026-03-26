"use client";

import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import { Button } from "@workspace/ui/components/button";
import { FormEvent, useState } from "react";

export const StripeCheckoutForm = () => {
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
