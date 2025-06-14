
import { useState } from "react";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { AuthPage } from "@/components/AuthPage";
import { useProfile } from "@/hooks/useProfile";
import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { LoadingScreen } from "@/components/LoadingScreen";

const DashboardContent = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!user) {
    return <AuthPage />;
  }

  if (loading) {
    return <LoadingScreen />;
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

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userStats={userStats}
          setUserStats={setUserStats}
          profile={profile}
        />
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
