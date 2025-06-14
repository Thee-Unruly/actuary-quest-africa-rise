
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, TrendingUp, Target, MessageSquare } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { QuestModule } from "@/components/QuestModule";
import { VirtualSandbox } from "@/components/VirtualSandbox";
import { CommunityHub } from "@/components/CommunityHub";
import { DashboardHeader } from "./DashboardHeader";
import { UserStatsCard } from "./UserStatsCard";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DashboardContent = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!user) return null;
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const userStats = {
    riskCoins: profile?.risk_coins || 0,
    questsCompleted: profile?.total_quests_completed || 0,
    sandboxScore: profile?.sandbox_score || 0,
    communityRank: profile?.community_rank || "Beginner Actuarian"
  };

  const setUserStats = async (newStats: typeof userStats) => {
    try {
      await updateProfile({
        risk_coins: newStats.riskCoins,
        total_quests_completed: newStats.questsCompleted,
        sandbox_score: newStats.sandboxScore,
        community_rank: newStats.communityRank
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader userStats={userStats} />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learning Quests
            </TabsTrigger>
            <TabsTrigger value="sandbox" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              News & Trends
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Community
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <UserStatsCard userStats={userStats} profile={profile} />
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
          </TabsContent>
          <TabsContent value="quests">
            <QuestModule userStats={userStats} setUserStats={setUserStats} />
          </TabsContent>
          <TabsContent value="sandbox">
            <VirtualSandbox userStats={userStats} setUserStats={setUserStats} />
          </TabsContent>
          <TabsContent value="community">
            <CommunityHub />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
