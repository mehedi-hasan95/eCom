"use client";

import { useEffect, useState } from "react";
import { AuthLayout } from "./auth-layout";
import { ModifyOtp } from "@/components/common/modify/modify-otp";
import { LoadingButton } from "@/components/common/loading-button";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface Props {
  setOTP: React.Dispatch<React.SetStateAction<string>>;
  onOTP: string;
  onSubmit: () => void;
  validTill?: number;
  loading: boolean;
}
export const EmailOtpVerification = ({
  onOTP,
  setOTP,
  onSubmit,
  validTill = 300,
  loading,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState<number>(validTill);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  useEffect(() => {
    if (timeLeft > 0 && isTimerActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
  }, [timeLeft, isTimerActive]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <AuthLayout
      title="Verify Your Account"
      description="Enter the 6-digit verification code sent to your email"
      showFooter={false}
      backButtonLink=""
      backButtonText=""
    >
      <div className="">
        <ModifyOtp otp={onOTP} setOtp={setOTP} />
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-4">
            {isTimerActive ? (
              <>
                Time remaining:{" "}
                <span className="font-mono font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </>
            ) : (
              <span className="text-red-500">Code expired</span>
            )}
          </div>
          {loading ? (
            <LoadingButton title="Verifying..." className="w-full" />
          ) : (
            <Button
              type="submit"
              className={cn("w-full mb-3")}
              disabled={onOTP.length !== 6}
              onClick={onSubmit}
            >
              Verify Code
            </Button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};
