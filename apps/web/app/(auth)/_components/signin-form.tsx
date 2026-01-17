"use client";

import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@workspace/open-api/schemas/auth.schemas";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { Checkbox } from "@workspace/ui/components/checkbox";

export const SignInForm = () => {
  const form = useForm<z.input<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });
  function onSubmit(data: z.input<typeof loginSchema>) {
    console.log(data);
  }
  return (
    <div className="space-y-4">
      <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-email">Your Email</FieldLabel>
                <Input
                  {...field}
                  id="login-form-title"
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
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-password">Password</FieldLabel>
                <Input
                  {...field}
                  id="login-form-password"
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
          <div className="flex gap-5">
            <Controller
              name="rememberMe"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  orientation="horizontal"
                >
                  <Checkbox
                    id="login-form-rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor="login-form-rememberMe">
                    Remember Me
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Link href={"/forgot-password"}>
              <Button variant={"link"}>Forgot Password?</Button>
            </Link>
          </div>
        </FieldGroup>
      </form>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="login-form">
          Submit
        </Button>
      </Field>
    </div>
  );
};
