import { useIntersectionObserver } from "@/hooks/products/use-interseption-observer";
import { Button } from "@workspace/ui/components/button";
import { useEffect } from "react";

interface InfinityScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  finishText?: string;
}
export const InfinityScroll = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isManual = false,
  finishText = "All product are loaded",
}: InfinityScrollProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isIntersecting,
    isManual,
  ]);
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div ref={targetRef} className="h-1" />
        {hasNextPage ? (
          <Button
            variant={"secondary"}
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        ) : (
          <p>{finishText}</p>
        )}
      </div>
    </div>
  );
};
