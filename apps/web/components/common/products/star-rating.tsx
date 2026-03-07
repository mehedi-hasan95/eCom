import { cn } from "@workspace/ui/lib/utils";
import { Star } from "lucide-react";

const MAX_RATING = 5;
const MIN_RATING = 0;

interface Props {
  rating: number;
  className?: string;
  iconClassName?: string;
  totalRatings?: number;
}

export const StarRating = ({
  rating,
  className,
  iconClassName,
  totalRatings,
}: Props) => {
  const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));

  // Calculate full stars and partial star percentage
  const fullStars = Math.floor(safeRating);
  const partialStarPercentage = (safeRating - fullStars) * 100;
  const hasPartialStar = partialStarPercentage > 0;

  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => {
        // Full star
        if (index < fullStars) {
          return (
            <Star
              key={index}
              className={cn(
                "size-4 fill-yellow-400 text-yellow-400",
                iconClassName,
              )}
            />
          );
        }

        // Partial star
        if (index === fullStars && hasPartialStar) {
          return (
            <div key={index} className="relative">
              <Star className={cn("size-4 text-gray-300", iconClassName)} />
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${partialStarPercentage}%` }}
              >
                <Star
                  className={cn(
                    "size-4 fill-yellow-400 text-yellow-400",
                    iconClassName,
                  )}
                />
              </div>
            </div>
          );
        }

        // Empty star
        return (
          <Star
            key={index}
            className={cn("size-4 text-gray-300", iconClassName)}
          />
        );
      })}
      <span className="text-sm font-medium text-foreground">
        {rating} ({totalRatings}{" "}
        {totalRatings && totalRatings > 1 ? "reviews" : "review"})
      </span>
    </div>
  );
};
