
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface UserStatsProps {
  userStats: {
    riskCoins: number;
    questsCompleted: number;
    sandboxScore: number;
    communityRank: string;
  };
  profile: any;
}

export const UserStats = ({ userStats, profile }: UserStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Progress Overview */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Quests Completed</span>
              <span>{userStats.questsCompleted}/20</span>
            </div>
            <Progress value={(userStats.questsCompleted / 20) * 100} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Sandbox Mastery</span>
              <span>{userStats.sandboxScore}%</span>
            </div>
            <Progress value={userStats.sandboxScore} className="h-2" />
          </div>
          
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {userStats.communityRank}
            </Badge>
            <Badge variant="outline">{profile?.role}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Risk Coins</span>
            <span className="font-bold text-yellow-600">{userStats.riskCoins}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Streak</span>
            <span className="font-bold">{profile?.current_streak || 0} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Completed</span>
            <span className="font-bold text-orange-600">{userStats.questsCompleted}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
