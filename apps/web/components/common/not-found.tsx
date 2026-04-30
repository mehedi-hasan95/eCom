"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface Props {
  title?: string;
  description?: string;
  showMenu?: boolean;
}
export const NotFound = ({
  title = "Page Not Found",
  description = "We couldn't find what you're looking for.Let's get you back on track.",
  showMenu = true,
}: Props) => {
  return (
    <div className="bg-background text-foreground flex flex-col items-center justify-center px-4 py-16 overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Large 404 Display */}
        <div className="relative">
          <div className="text-9xl md:text-[160px] font-bold text-foreground/10 dark:text-foreground/15 select-none leading-none tracking-tighter">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Elements */}
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="font-semibold gap-2 px-8">
            <Link href="/">
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </Button>
        </div>

        {/* Helpful Links Section */}
        {showMenu && (
          <div className="pt-12 border-t border-border">
            <p className="text-sm text-muted-foreground mb-6">Popular Pages</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-accent/50 transition-colors text-sm font-medium text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
