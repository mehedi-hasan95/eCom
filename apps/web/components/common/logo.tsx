import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

interface Props {
  className?: string;
}
export const Logo = ({ className }: Props) => {
  return (
    <Link
      href={"/"}
      className={cn("text-2xl md:text-3xl font-bold underline", className)}
    >
      eCom
    </Link>
  );
};
