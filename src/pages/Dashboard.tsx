import { AppLayout } from "@/components/layout/AppLayout";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { GridLayout } from "@/components/layout/GridLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Gift, TrendingUp, Settings, Bell, Image as ImageIcon, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const stats = [
    {
      label: "Photos Uploaded",
      value: "12",
      icon: Camera,
      change: "+3 this week",
      color: "text-primary"
    },
    {
      label: "Discounts Earned",
      value: "$48",
      icon: Gift,
      change: "5% each",
      color: "text-accent"
    },
    {
      label: "Points",
      value: "850",
      icon: TrendingUp,
      change: "Level 3",
      color: "text-primary"
    },
  ];

  const recentActivity = [
    {
      restaurant: "Sunset Bistro",
      action: "Uploaded 2 photos",
      time: "2 hours ago",
      discount: "5%",
    },
    {
      restaurant: "The Garden Cafe",
      action: "Discount used",
      time: "Yesterday",
      discount: "-",
    },
    {
      restaurant: "Urban Kitchen",
      action: "Uploaded 1 photo",
      time: "3 days ago",
      discount: "5%",
    },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="border-b bg-card">
        <ScreenLayout>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Welcome back, John!</h2>
                <p className="text-sm text-muted-foreground">Level 3 Contributor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </ScreenLayout>
      </div>

      <ScreenLayout>
        {/* Quick Actions */}
        <div className="py-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1 h-16" asChild>
              <Link to="/camera">
                <Camera className="mr-2 h-5 w-5" />
                Upload Photo
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-16" asChild>
              <Link to="/restaurants">
                <MapPin className="mr-2 h-5 w-5" />
                Discover Nearby
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-16" asChild>
              <Link to="/discounts">
                <Gift className="mr-2 h-5 w-5" />
                My Discounts
              </Link>
            </Button>
          </div>
          {isAdmin && (
            <Button size="lg" variant="default" className="w-full h-16 mt-3" asChild>
              <Link to="/admin">
                <Shield className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Link>
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Your Stats</h3>
          <GridLayout>
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </GridLayout>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Recent Activity</h3>
            <Button variant="ghost" asChild>
              <Link to="/activity">View All</Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 ${
                    index !== recentActivity.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.restaurant}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.discount !== "-" && (
                      <Badge variant="secondary" className="mb-1">
                        {activity.discount} OFF
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* CTA Card */}
        <Card className="bg-gradient-primary text-primary-foreground border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to earn more rewards?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Upload photos from your dining experiences and get instant discounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/camera">
                <Camera className="mr-2 h-5 w-5" />
                Start Uploading
              </Link>
            </Button>
          </CardContent>
        </Card>
      </ScreenLayout>
      <BottomNav />
    </AppLayout>
  );
};

export default Dashboard;
