import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex h-[40px] w-full border-0 placeholder:text-muted-foreground bg-background pr-3 py-2 text-lg focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden",
            className
          )}
          ref={ref}
          {...props}
        />
       
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
