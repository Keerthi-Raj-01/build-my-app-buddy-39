import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridLayoutProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}

export const GridLayout = ({ 
  children, 
  className,
  cols = 3 
}: GridLayoutProps) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div 
      className={cn(
        "grid gap-4 sm:gap-6",
        gridClasses[cols],
        className
      )}
    >
      {children}
    </div>
  );
};
