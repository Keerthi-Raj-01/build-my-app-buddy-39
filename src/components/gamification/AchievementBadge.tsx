import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

export const AchievementBadge = ({
  icon,
  title,
  description,
  points,
  unlocked,
  progress,
  total,
}: AchievementBadgeProps) => {
  return (
    <Card className={unlocked ? "bg-gradient-subtle" : "opacity-60"}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`text-4xl ${!unlocked && "filter grayscale"}`}>
            {unlocked ? icon : <Lock className="h-10 w-10 text-muted-foreground" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold">{title}</h3>
              <Badge variant="secondary" className="ml-2">
                {points} pts
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
            {!unlocked && progress !== undefined && total !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{progress}/{total}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(progress / total) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {unlocked && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                Unlocked!
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
