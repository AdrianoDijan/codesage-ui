import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";

export default function StateButton({
  children,
  variant = "default",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant"> & {
  variant?: "default" | "loading" | "success" | "error";
}) {
  let buttonContent;
  let buttonClassName;

  switch (variant) {
    case "loading":
      buttonContent = (
        <>
          <Loader2 className="mr-2 animate-spin" />
          Loading...
        </>
      );
      buttonClassName = "bg-primary animate-pulse";
      break;
    case "success":
      buttonContent = (
        <>
          <Check className="mr-2" />
          Success!
        </>
      );
      buttonClassName = "bg-green-500 hover:bg-green-600";
      break;
    case "error":
      buttonContent = (
        <>
          <X className="mr-2" />
          Error!
        </>
      );
      buttonClassName = "bg-red-500 hover:bg-red-600";
      break;
    default:
      buttonContent = children;
  }

  return (
    <Button className={cn(className, buttonClassName)} {...props}>
      {buttonContent}
    </Button>
  );
}
