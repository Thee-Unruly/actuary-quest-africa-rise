
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { UserStats } from "./UserStats";

interface DashboardOverviewProps {
  userStats: {
    riskCoins: number;
    questsCompleted: number;
    sandboxScore: number;
    communityRank: string;
  };
  profile: any;
}

export const DashboardOverview = ({ userStats, profile }: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      <UserStats userStats={userStats} profile={profile} />

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium">Welcome to Actuarial Hub!</p>
                <p className="text-sm text-gray-600">Start your learning journey • Just now</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
