
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export const UserStatsCard = ({ userStats, profile }: { userStats: any; profile: any }) => (
  <Card className="md:col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Your Progress
      </CardTitle>
      <span className="text-sm text-gray-500">Track your actuarial learning journey</span>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Quests Completed</span>
          <span>{userStats.questsCompleted}/20</span>
        </div>
        {/* For brevity, use a progress bar from shadcn if available */}
        <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
          <div className="bg-yellow-400 h-2 rounded" style={{ width: `${(userStats.questsCompleted / 20) * 100}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Sandbox Mastery</span>
          <span>{userStats.sandboxScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
          <div className="bg-green-400 h-2 rounded" style={{ width: `${userStats.sandboxScore}%` }} />
        </div>
      </div>
      <div className="flex gap-2">
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          {userStats.communityRank}
        </Badge>
        <Badge variant="outline">{profile?.role}</Badge>
      </div>
    </CardContent>
  </Card>
);
