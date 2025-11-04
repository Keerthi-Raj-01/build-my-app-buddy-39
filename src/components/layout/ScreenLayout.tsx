import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScreenLayoutProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const ScreenLayout = ({ 
  children, 
  className,
  noPadding = false 
}: ScreenLayoutProps) => {
  return (
    <div 
      className={cn(
        "w-full mx-auto max-w-7xl",
        !noPadding && "px-4 sm:px-6 lg:px-8 py-6",
        className
      )}
    >
      {children}
    </div>
  );
};
