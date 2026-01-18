"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  forgetPasswordEmailAction,
  forgetPasswordEmailOtpAction,
  resetPasswordAction,
} from "@/lib/actions/auth-action";
import { EmailVerificationForm } from "../../_components/email-verification-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmailOtpVerification } from "../../_components/email-otp-verification";
import { UpdatePasswordForm } from "../../_components/update-password-form";

export const ForgetPasswordForm = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  // Reset password email
  const getEmailMutation = useMutation({
    mutationFn: forgetPasswordEmailAction,
    onSuccess: (data) => {
      toast.success("Success", { description: data.message });
      setStep("otp");
    },
    onError: (error) => {
      toast.error("Error", { description: error.message });
    },
  });

  // verify the OTP
  const verifyOtpMutation = useMutation({
    mutationFn: forgetPasswordEmailOtpAction,
    onSuccess: (data) => {
      toast.success("Success", { description: data.message });
      setStep("reset");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Reset forgot password
  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordAction,
    onSuccess: (data) => {
      router.push("/sign-in");
      toast.success(data.message);
    },
    onError: (error) => {
      const errorMessage =
        error.message ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).errors?.[0]?.message ||
        "An error occurred";
      toast.error(errorMessage);
    },
  });
  return (
    <>
      {step === "email" ? (
        <EmailVerificationForm
          email={email}
          loading={getEmailMutation.isPending}
          onSubmit={() => getEmailMutation.mutate({ email })}
          disabled={false}
          onEmailChange={setEmail}
        />
      ) : step === "otp" ? (
        <EmailOtpVerification
          loading={verifyOtpMutation.isPending}
          onOTP={otp}
          onSubmit={() => verifyOtpMutation.mutate({ email, otp })}
          setOTP={setOtp}
        />
      ) : (
        <UpdatePasswordForm
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={() =>
            resetPasswordMutation.mutate({
              email,
              otp,
              password,
              confirmPassword,
            })
          }
          loading={resetPasswordMutation.isPending}
        />
      )}
    </>
  );
};
