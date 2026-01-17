import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2 } from "lucide-react";

interface Props {
  className?: string;
  title?: string;
}
export const LoadingButton = ({ className, title = "Loading..." }: Props) => {
  return (
    <Button disabled className={cn(className)}>
      {title} <Loader2 className="animate-spin" />
    </Button>
  );
};
