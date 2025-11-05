import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string;
  points: number;
  uploads: number;
  level: number;
  badge?: string;
  isCurrentUser?: boolean;
}

const Leaderboard = () => {
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");

  const weeklyLeaders: LeaderboardUser[] = [
    { rank: 1, name: "Sarah Chen", points: 2850, uploads: 57, level: 8, badge: "🏆 Gold", isCurrentUser: false },
    { rank: 2, name: "Mike Rodriguez", points: 2640, uploads: 53, level: 7, badge: "🥈 Silver" },
    { rank: 3, name: "Emma Wilson", points: 2420, uploads: 48, level: 7, badge: "🥉 Bronze" },
    { rank: 4, name: "John Doe", points: 850, uploads: 17, level: 3, isCurrentUser: true },
    { rank: 5, name: "Lisa Kim", points: 780, uploads: 16, level: 3 },
    { rank: 6, name: "Tom Brown", points: 650, uploads: 13, level: 2 },
    { rank: 7, name: "Anna Smith", points: 590, uploads: 12, level: 2 },
    { rank: 8, name: "David Lee", points: 520, uploads: 10, level: 2 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <AppLayout>
      <div className="border-b bg-card">
        <ScreenLayout>
          <div className="py-4">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Leaderboard</h1>
            </div>
            <p className="text-muted-foreground">
              Top contributors in the AmbienSee community
            </p>
          </div>
        </ScreenLayout>
      </div>

      <ScreenLayout>
        <Tabs defaultValue="week" className="w-full" onValueChange={(v) => setPeriod(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-3">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {weeklyLeaders.slice(0, 3).map((user, idx) => (
                <Card
                  key={user.rank}
                  className={`text-center ${
                    idx === 0 ? "order-2" : idx === 1 ? "order-1" : "order-3"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-center mb-2">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground mb-1">
                      Level {user.level}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {user.points} pts
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Rest of leaderboard */}
            <div className="space-y-2">
              {weeklyLeaders.slice(3).map((user) => (
                <Card
                  key={user.rank}
                  className={user.isCurrentUser ? "border-primary bg-primary/5" : ""}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 flex justify-center">
                        {getRankIcon(user.rank)}
                      </div>

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {user.name}
                          {user.isCurrentUser && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              You
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Level {user.level} • {user.uploads} uploads
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-primary">{user.points}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="month" className="space-y-3">
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Monthly rankings will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-3">
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">All-time rankings will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Points Explanation */}
        <Card className="mt-6 bg-gradient-subtle">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">How Points Work</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Upload a photo: <span className="font-semibold text-foreground">50 points</span></p>
              <p>• Photo gets a like: <span className="font-semibold text-foreground">5 points</span></p>
              <p>• Photo gets a comment: <span className="font-semibold text-foreground">10 points</span></p>
              <p>• Complete a challenge: <span className="font-semibold text-foreground">100 points</span></p>
              <p>• Refer a friend: <span className="font-semibold text-foreground">200 points</span></p>
            </div>
          </CardContent>
        </Card>
      </ScreenLayout>
    </AppLayout>
  );
};

export default Leaderboard;
