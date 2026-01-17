import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
  backButtonLink?: string;
  backButtonText?: string;
  className?: string;
  showFooter?: boolean;
}
export const AuthLayout = ({
  children,
  title = "Welcome Back. Login to your account",
  description = "Sign in to manage your orders, track your shipments, and access your dashboard.",
  backButtonLink = "/register",
  backButtonText = "Sign Up",
  className,
  showFooter = true,
}: Props) => {
  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Link href={backButtonLink}>
            <Button variant={"link"}>{backButtonText}</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showFooter && (
        <CardFooter className="flex-col gap-2">
          <div className="flex items-center pt-4 space-x-1">
            <div className="flex-1 h-px sm:w-16 bg-amber-500"></div>
            <p className="px-3 text-sm dark:text-gray-300">
              {backButtonLink === "/register" ? "Login" : "Register"} with
              social accounts
            </p>
            <div className="flex-1 h-px sm:w-16 bg-amber-500"></div>
          </div>
          <Button variant="outline" className="w-full">
            {backButtonLink === "/register" ? "Login" : "Register"} with Google
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
