import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface ActivityCardProps {
  user: string;
  action: string;
  restaurant?: string;
  badge?: string;
  time: string;
  image?: string;
  likes: number;
  comments?: number;
}

export const ActivityCard = ({
  user,
  action,
  restaurant,
  badge,
  time,
  image,
  likes: initialLikes,
  comments,
}: ActivityCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-semibold">{user}</span>{" "}
              <span className="text-muted-foreground">{action}</span>
              {restaurant && (
                <span className="font-semibold"> at {restaurant}</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>

        {/* Badge Achievement */}
        {badge && (
          <div className="mb-3 p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
            <p className="text-center font-semibold text-lg">{badge}</p>
          </div>
        )}

        {/* Image */}
        {image && (
          <div className="mb-3 rounded-lg overflow-hidden aspect-square">
            <img
              src={image}
              alt="Activity"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={liked ? "text-primary" : ""}
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 mr-1 ${liked ? "fill-primary" : ""}`}
            />
            <span>{likes}</span>
          </Button>

          {comments !== undefined && (
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{comments}</span>
            </Button>
          )}

          <Button variant="ghost" size="sm" className="ml-auto">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
