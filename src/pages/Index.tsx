import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Coins, Users, BookOpen, Calculator, Target, MessageSquare, TrendingUp, LogOut, Settings } from "lucide-react";
import { QuestModule } from "@/components/QuestModule";
import { VirtualSandbox } from "@/components/VirtualSandbox";
import { CommunityHub } from "@/components/CommunityHub";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { AuthPage } from "@/components/AuthPage";
import { useProfile } from "@/hooks/useProfile";

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
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Actuarial Hub</h1>
                <p className="text-gray-600">Welcome back, {profile?.full_name || user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-900">{userStats.riskCoins}</span>
                <span className="text-sm text-gray-600">Risk Coins</span>
              </div>
              
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-orange-500 text-white">
                  {profile?.full_name?.split(' ').map(n => n[0]).join('') || user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {(profile?.role === 'admin' || profile?.role === 'instructor') && (
                <Button 
                  variant="default" 
                  size="default" 
                  onClick={() => window.location.href = '/admin'}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Admin Panel
                </Button>
              )}
              
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

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
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Your Progress
                  </CardTitle>
                  <CardDescription>Track your actuarial learning journey</CardDescription>
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
