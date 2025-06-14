
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, BookOpen, TrendingUp, MessageSquare } from "lucide-react";
import { QuestModule } from "@/components/QuestModule";
import { VirtualSandbox } from "@/components/VirtualSandbox";
import { CommunityHub } from "@/components/CommunityHub";
import { DashboardOverview } from "@/components/DashboardOverview";

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userStats: {
    riskCoins: number;
    questsCompleted: number;
    sandboxScore: number;
    communityRank: string;
  };
  setUserStats: (stats: any) => Promise<void>;
  profile: any;
}

export const NavigationTabs = ({ 
  activeTab, 
  setActiveTab, 
  userStats, 
  setUserStats, 
  profile 
}: NavigationTabsProps) => {
  return (
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

      <TabsContent value="dashboard">
        <DashboardOverview userStats={userStats} profile={profile} />
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
  );
};
