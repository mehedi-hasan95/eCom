"use client";

import {
  emailVerificaionAction,
  emailVerificaionOTPAction,
} from "@/lib/actions/auth-action";
import { useMutation } from "@tanstack/react-query";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { EmailVerificationForm } from "../_components/email-verification-form";
import { toast } from "sonner";
import { EmailOtpVerification } from "../_components/email-otp-verification";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchResult = searchParams.get("email");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState("");

  if (!searchResult) {
    redirect("/sign-in");
  }

  const verifyEmail = useMutation({
    mutationFn: emailVerificaionAction,
    onSuccess: () => {
      setStep("otp");
      toast.success("Success", {
        description: "A verification email sent to your email",
      });
    },
    onError: (error) => {
      router.push("/");
      toast.error(error.message);
    },
  });

  const emailVerification = useMutation({
    mutationFn: emailVerificaionOTPAction,
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error("Error", { description: data.error.body.message });
      } else {
        toast.success("Success", {
          description: "You have successfully verified.",
        });
        router.push("/sign-in");
      }
    },
  });
  return (
    <>
      {step === "email" ? (
        <EmailVerificationForm
          email={searchResult}
          loading={verifyEmail.isPending}
          onSubmit={() => verifyEmail.mutate({ email: searchResult })}
        />
      ) : (
        <EmailOtpVerification
          loading={emailVerification.isPending}
          onOTP={otp}
          onSubmit={() =>
            emailVerification.mutate({ email: searchResult, otp })
          }
          setOTP={setOtp}
        />
      )}
    </>
  );
};

export default Page;
