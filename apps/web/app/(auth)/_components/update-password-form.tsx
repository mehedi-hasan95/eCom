"use client";

import { Label } from "@workspace/ui/components/label";
import { AuthLayout } from "./auth-layout";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { LoadingButton } from "@/components/common/loading-button";

interface Props {
  setPassword: (value: string) => void;
  password: string;
  setConfirmPassword: (value: string) => void;
  confirmPassword: string;
  onSubmit: () => void;
  loading: boolean;
}
export const UpdatePasswordForm = ({
  confirmPassword,
  loading,
  onSubmit,
  password,
  setConfirmPassword,
  setPassword,
}: Props) => {
  return (
    <AuthLayout
      backButtonLink=""
      backButtonText=""
      showFooter={false}
      description="Enter your password"
      title="Your new password"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="******"
            onChange={(e) => setPassword(e.target.value)}
            defaultValue={password}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cPassword">Confirm Password</Label>
          <Input
            type="password"
            id="cPassword"
            placeholder="******"
            onChange={(e) => setConfirmPassword(e.target.value)}
            defaultValue={confirmPassword}
          />
        </div>
        {loading ? (
          <LoadingButton />
        ) : (
          <Button type="submit" onClick={onSubmit}>
            Submit
          </Button>
        )}
      </div>
    </AuthLayout>
  );
};
