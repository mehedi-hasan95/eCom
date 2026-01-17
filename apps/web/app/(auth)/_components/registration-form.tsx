"use client";

import {
  emailVerificaionAction,
  emailVerificaionOTPAction,
  registrationAction,
} from "@/components/actions/auth-action";
import { LoadingButton } from "@/components/common/loading-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registrationSchema } from "@workspace/open-api/schemas/auth.schemas";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { EmailOtpVerification } from "./email-otp-verification";
import { AuthLayout } from "./auth-layout";
import { toast } from "sonner";

export const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"register" | "verify">("register");
  const [otp, setOtp] = useState("");

  const form = useForm<z.input<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const registrationMutation = useMutation({
    mutationFn: registrationAction,
    onSuccess: async (data) => {
      if (data.user.id) {
        await emailVerificaionAction({ email: form.getValues("email") });
        setStep("verify");
        toast.success("Success", {
          description: "A verification email sent to your email",
        });
      }
    },
    onError: (error) => {
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
      }
    },
  });

  function onSubmit(data: z.input<typeof registrationSchema>) {
    registrationMutation.mutate(data);
  }
  return (
    <>
      {step === "register" ? (
        <AuthLayout
          backButtonLink="/sign-in"
          backButtonText="Sign In"
          description="Join our global network of professional. Scale your business with our robust logistics, integrated payment systems, and a dedicated customer base ready to discover your products."
          title="Become an Official Partner"
          className="max-w-lg"
        >
          <form id="registration-id" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="grid md:grid-cols-2 gap-5">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="registration-id-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="registration-id-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Jone Doe"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="registration-id-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="registration-id-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@domain.com"
                      autoComplete="off"
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="registration-id-role">
                      User Role
                    </FieldLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="registration-id-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="SELLER">Seller</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="registration-id-phone">
                      Phone
                    </FieldLabel>
                    <Input
                      {...field}
                      id="registration-id-phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="012345678"
                      autoComplete="off"
                      type="tel"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="registration-id-password">
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="registration-id-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="******"
                        autoComplete="off"
                        type={showPassword ? "text" : "password"}
                        className="pr-9"
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="registration-id-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="registration-id-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="******"
                      autoComplete="off"
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          <Field orientation="horizontal" className="pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            {registrationMutation.isPending ? (
              <LoadingButton />
            ) : (
              <Button type="submit" form="registration-id">
                Register
              </Button>
            )}
          </Field>
        </AuthLayout>
      ) : (
        <EmailOtpVerification
          loading={emailVerification.isPending}
          onOTP={otp}
          onSubmit={() =>
            emailVerification.mutate({ email: form.getValues("email"), otp })
          }
          setOTP={setOtp}
        />
      )}
    </>
  );
};
