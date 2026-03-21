import { Logo } from "@/components/common/logo";
import { AuthButton } from "./auth-button";
import { WishlistCount } from "@/components/common/products/wishlist-count";
import { GetAddToCart } from "@/components/common/products/get-add-to-cart";

export const NavHeader = () => {
  return (
    <div className="flex items-center justify-between h-16">
      <Logo />
      <div className="flex items-center gap-4 relative">
        <WishlistCount />
        <GetAddToCart />
        <AuthButton />
      </div>
    </div>
  );
};
