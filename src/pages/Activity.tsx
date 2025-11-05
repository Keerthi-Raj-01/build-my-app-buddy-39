import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { ActivityCard } from "@/components/community/ActivityCard";
import { Card, CardContent } from "@/components/ui/card";
import { Camera } from "lucide-react";

const Activity = () => {
  const activities = [
    {
      id: 1,
      user: "Sarah Chen",
      action: "uploaded 2 photos",
      restaurant: "Sunset Bistro",
      time: "2 hours ago",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      likes: 24,
      comments: 3,
    },
    {
      id: 2,
      user: "Mike Rodriguez",
      action: "earned a badge",
      badge: "🏆 Gold Contributor",
      time: "3 hours ago",
      likes: 18,
    },
    {
      id: 3,
      user: "Emma Wilson",
      action: "uploaded 1 photo",
      restaurant: "The Garden Cafe",
      time: "5 hours ago",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      likes: 31,
      comments: 7,
    },
    {
      id: 4,
      user: "Tom Brown",
      action: "reached Level 5",
      time: "Yesterday",
      likes: 12,
    },
    {
      id: 5,
      user: "Lisa Kim",
      action: "uploaded 3 photos",
      restaurant: "Urban Kitchen",
      time: "Yesterday",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
      likes: 42,
      comments: 5,
    },
  ];

  return (
    <AppLayout>
      <div className="border-b bg-card">
        <ScreenLayout>
          <div className="py-4">
            <h1 className="text-2xl font-bold mb-2">Community Activity</h1>
            <p className="text-muted-foreground">
              See what other food lovers are sharing
            </p>
          </div>
        </ScreenLayout>
      </div>

      <ScreenLayout>
        {activities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No Activity Yet</h3>
              <p className="text-sm text-muted-foreground">
                Community activity will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </div>
        )}
      </ScreenLayout>
    </AppLayout>
  );
};

export default Activity;
