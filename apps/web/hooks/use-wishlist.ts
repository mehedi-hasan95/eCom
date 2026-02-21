import { getWishlistAction } from "@/lib/actions/wishlist-action";
import { useQuery } from "@tanstack/react-query";

export const useWishlistData = () => {
  const { data } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistAction,
    staleTime: 1000 * 60 * 5,
  });
  return { data };
};
