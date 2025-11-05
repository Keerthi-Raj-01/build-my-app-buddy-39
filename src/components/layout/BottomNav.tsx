import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Camera, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/restaurants", icon: Compass, label: "Discover" },
    { path: "/camera", icon: Camera, label: "Upload" },
    { path: "/discounts", icon: Gift, label: "Discounts" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-40 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6 mb-1", isActive && "fill-primary")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
