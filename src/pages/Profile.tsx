import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { GridLayout } from "@/components/layout/GridLayout";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AchievementBadge } from "@/components/gamification/AchievementBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Settings, 
  Award, 
  TrendingUp, 
  Gift,
  MapPin,
  Users,
  ArrowLeft,
  Edit
} from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const userStats = [
    { label: "Photos", value: "12", icon: Camera },
    { label: "Followers", value: "45", icon: Users },
    { label: "Following", value: "32", icon: Users },
    { label: "Points", value: "850", icon: TrendingUp },
  ];

  const detailedAchievements = [
    {
      icon: "🏆",
      title: "First Upload",
      description: "Upload your first restaurant photo",
      points: 50,
      unlocked: true,
    },
    {
      icon: "📸",
      title: "Photography Pro",
      description: "Upload 50 photos",
      points: 500,
      unlocked: false,
      progress: 12,
      total: 50,
    },
    {
      icon: "⭐",
      title: "Rising Star",
      description: "Get 100 total likes",
      points: 200,
      unlocked: false,
      progress: 34,
      total: 100,
    },
    {
      icon: "🎯",
      title: "Consistency King",
      description: "Upload photos 7 days in a row",
      points: 300,
      unlocked: false,
      progress: 3,
      total: 7,
    },
  ];

  const uploadHistory = [
    {
      id: 1,
      restaurant: "Sunset Bistro",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      likes: 24,
      date: "2 days ago",
    },
    {
      id: 2,
      restaurant: "The Garden Cafe",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
      likes: 18,
      date: "5 days ago",
    },
    {
      id: 3,
      restaurant: "Urban Kitchen",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      likes: 31,
      date: "1 week ago",
    },
  ];


  return (
    <AppLayout>
      {/* Header */}
      <div className="border-b bg-card">
        <ScreenLayout>
          <div className="flex items-center justify-between py-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Profile</h1>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </ScreenLayout>
      </div>

      <ScreenLayout>
        {/* Profile Header */}
        <div className="py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    variant="secondary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <h2 className="text-2xl font-bold mb-1">John Doe</h2>
                <p className="text-muted-foreground mb-3">@johndoe</p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">Level 3</Badge>
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                    Top Contributor
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground max-w-md">
                  Food enthusiast 🍕 | Restaurant explorer | Sharing authentic dining experiences across the city
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                {userStats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-center mb-1">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex gap-3">
                <Button className="flex-1">Edit Profile</Button>
                <Button variant="outline" className="flex-1">Share Profile</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Achievements</h3>
            <Button variant="ghost" asChild>
              <Link to="/achievements">View All</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {detailedAchievements.map((achievement, index) => (
              <AchievementBadge key={index} {...achievement} />
            ))}
          </div>
        </div>

        {/* Upload History */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Upload History</h3>
            <Button variant="ghost">View All</Button>
          </div>

          <GridLayout>
            {uploadHistory.map((upload) => (
              <Card key={upload.id} className="overflow-hidden group cursor-pointer">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={upload.image}
                    alt={upload.restaurant}
                    className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-smooth flex items-end">
                    <div className="p-4 text-white w-full">
                      <p className="font-semibold">{upload.restaurant}</p>
                      <p className="text-sm opacity-90">{upload.likes} likes</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="font-medium mb-1">{upload.restaurant}</p>
                  <p className="text-sm text-muted-foreground">{upload.date}</p>
                </CardContent>
              </Card>
            ))}
          </GridLayout>
        </div>
      </ScreenLayout>
      <BottomNav />
    </AppLayout>
  );
};

export default Profile;
