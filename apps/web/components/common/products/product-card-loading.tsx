import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

interface Props {
  className?: string;
  size?: number;
}
export const ProductCardLoading = ({ className, size = 4 }: Props) => {
  return (
    <div className="default-container">
      <div
        className={cn(
          "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
          className,
        )}
      >
        {Array.from({ length: size }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="flex gap-3 w-full">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-10 w-1/4" />
            </div>

            <Skeleton className="h-64 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
