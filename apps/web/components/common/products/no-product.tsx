import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface Props {
  className?: string;
}
export const NoProduct = ({ className }: Props) => {
  return (
    <main
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary px-4 py-20 w-full",
        className,
      )}
    >
      <div className="text-center mx-auto space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6 ring-8 ring-primary/5">
            <ShoppingBag className="h-16 w-16 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            No Products Yet
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We&rsquo;re currently updating our collection. Check back soon for
            exciting new items or explore our other categories.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="h-12 px-8 text-base font-medium">
            Browse Collections
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base font-medium"
          >
            Back to Home
          </Button>
        </div>

        {/* Info Section */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">100%</div>
            <p className="text-sm text-muted-foreground">Curated Selection</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">Free</div>
            <p className="text-sm text-muted-foreground">Shipping on Orders</p>
          </div>
          <div className="space-y-2 col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <p className="text-sm text-muted-foreground">Customer Support</p>
          </div>
        </div>
      </div>
    </main>
  );
};
