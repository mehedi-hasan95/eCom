import { Logo } from "@/components/common/logo";
import { ShoppingBag } from "lucide-react";
import { AuthButton } from "./auth-button";
import { WishlistCount } from "@/components/common/products/wishlist-count";

export const NavHeader = () => {
  return (
    <div className="flex items-center justify-between h-16">
      <Logo />
      <div className="flex items-center gap-4 relative">
        <WishlistCount />
        <ShoppingBag />
        <AuthButton />
      </div>
    </div>
  );
};
