
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, BookOpen, TrendingUp, MessageSquare, Calculator } from "lucide-react";
import { QuestModule } from "@/components/QuestModule";
import { VirtualSandbox } from "@/components/VirtualSandbox";
import { CommunityHub } from "@/components/CommunityHub";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { AuthPage } from "@/components/AuthPage";
import { useProfile } from "@/hooks/useProfile";
import { Header } from "@/components/Header";
import { DashboardOverview } from "@/components/DashboardOverview";

const DashboardContent = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!user) {
    return <AuthPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-6 h-6 text-white animate-pulse" />
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
        <Header 
          profile={profile} 
          user={user} 
          riskCoins={userStats.riskCoins} 
          onSignOut={signOut} 
        />

        {/* Navigation Tabs */}
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

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <DashboardOverview userStats={userStats} profile={profile} />
          </TabsContent>

          {/* Learning Quests Tab */}
          <TabsContent value="quests">
            <QuestModule userStats={userStats} setUserStats={setUserStats} />
          </TabsContent>

          {/* News & Trends Tab */}
          <TabsContent value="sandbox">
            <VirtualSandbox userStats={userStats} setUserStats={setUserStats} />
          </TabsContent>

          {/* Community Hub Tab */}
          <TabsContent value="community">
            <CommunityHub />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
};

export default Index;
