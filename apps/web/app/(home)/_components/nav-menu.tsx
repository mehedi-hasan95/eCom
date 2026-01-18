import { Logo } from "@/components/common/logo";
import { Navigation } from "./navigation";

export const NavMenu = () => {
  return (
    <div className="flex justify-between">
      <Logo />
      <Navigation />
    </div>
  );
};
