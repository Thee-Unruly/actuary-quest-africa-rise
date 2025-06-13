
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Lock, Play, CheckCircle, Coins, Target } from "lucide-react";
import { toast } from "sonner";

interface QuestModuleProps {
  userStats: {
    riskCoins: number;
    questsCompleted: number;
    sandboxScore: number;
    communityRank: string;
  };
  setUserStats: (stats: any) => void;
}

export const QuestModule = ({ userStats, setUserStats }: QuestModuleProps) => {
  const [activeQuest, setActiveQuest] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [questProgress, setQuestProgress] = useState(0);
  const [premium, setPremium] = useState([1200]);
  const [deductible, setDeductible] = useState("");

  const quests = [
    {
      id: 1,
      title: "Auto Insurance Pricing Quest",
      description: "Help SafeDrive Insurance price policies for young drivers",
      difficulty: "Beginner",
      reward: 50,
      completed: true,
      story: "A 22-year-old student needs auto insurance. Help calculate a fair premium!",
      locked: false
    },
    {
      id: 2,
      title: "Life Insurance Adventure",
      description: "Navigate mortality tables and calculate life insurance premiums",
      difficulty: "Intermediate", 
      reward: 75,
      completed: false,
      story: "SecureLife Insurance needs your help pricing life policies for different age groups.",
      locked: false
    },
    {
      id: 3,
      title: "Property Risk Assessment",
      description: "Evaluate flood risks for coastal properties",
      difficulty: "Advanced",
      reward: 100,
      completed: false,
      story: "Climate risks are changing. Help OceanView Insurance adapt their pricing.",
      locked: userStats.questsCompleted < 2
    }
  ];

  const startQuest = (questId: number) => {
    setActiveQuest(questId);
    setCurrentStep(0);
    setQuestProgress(0);
  };

  const completeStep = () => {
    const newProgress = questProgress + 33.33;
    setQuestProgress(newProgress);
    
    if (newProgress >= 100) {
      // Quest completed
      const quest = quests.find(q => q.id === activeQuest);
      if (quest) {
        setUserStats({
          ...userStats,
          riskCoins: userStats.riskCoins + quest.reward,
          questsCompleted: userStats.questsCompleted + 1
        });
        
        toast.success(`Quest completed! Earned ${quest.reward} Risk Coins! 🎉`);
        setActiveQuest(null);
        setCurrentStep(0);
        setQuestProgress(0);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const QuestInterface = ({ quest }: { quest: typeof quests[0] }) => (
    <Card className="border-2 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          {quest.title} - Interactive Challenge
        </CardTitle>
        <CardDescription>{quest.story}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <span>Progress</span>
          <span className="text-sm text-gray-600">Step {currentStep + 1} of 3</span>
        </div>
        <Progress value={questProgress} className="h-2" />

        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 1: Set the Base Premium</h3>
            <p className="text-sm text-gray-600">
              A 22-year-old student with a clean driving record needs auto insurance. 
              The base rate for their demographic is $1,000-$1,500 annually.
            </p>
            <div>
              <Label>Annual Premium ($)</Label>
              <Slider
                value={premium}
                onValueChange={setPremium}
                max={2000}
                min={800}
                step={50}
                className="mt-2"
              />
              <div className="text-center mt-2 font-bold text-lg">
                ${premium[0].toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 2: Set the Deductible</h3>
            <p className="text-sm text-gray-600">
              Choose an appropriate deductible. Higher deductibles mean lower premiums but more out-of-pocket costs for claims.
            </p>
            <div>
              <Label>Deductible Amount ($)</Label>
              <Input
                type="number"
                placeholder="500"
                value={deductible}
                onChange={(e) => setDeductible(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Step 3: Review Your Pricing</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Annual Premium:</span>
                <span className="font-bold">${premium[0].toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Deductible:</span>
                <span className="font-bold">${deductible || "500"}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span>Risk Assessment:</span>
                <span className={`font-bold ${premium[0] > 1200 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {premium[0] > 1200 ? 'Well Priced' : 'Consider Higher Premium'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              AI Feedback: {premium[0] > 1200 
                ? "Excellent! Your pricing covers expected claims and provides adequate profit margin."
                : "Your premium might be too low to cover claims. Consider increasing it for better risk coverage."
              }
            </p>
          </div>
        )}

        <Button onClick={completeStep} className="w-full bg-orange-500 hover:bg-orange-600">
          {questProgress >= 66 ? 'Complete Quest' : 'Next Step'}
        </Button>
      </CardContent>
    </Card>
  );

  if (activeQuest) {
    const quest = quests.find(q => q.id === activeQuest);
    return quest ? <QuestInterface quest={quest} /> : null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Interactive Learning Quests
          </CardTitle>
          <CardDescription>
            Complete story-driven challenges to master actuarial concepts and earn Risk Coins!
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <Card key={quest.id} className={`relative ${quest.locked ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{quest.title}</CardTitle>
                  <CardDescription className="mt-2">{quest.description}</CardDescription>
                </div>
                {quest.locked && <Lock className="w-5 h-5 text-gray-400" />}
                {quest.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={quest.difficulty === 'Beginner' ? 'secondary' : 
                              quest.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                  {quest.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span>{quest.reward} coins</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{quest.story}</p>
              
              <Button 
                className="w-full" 
                variant={quest.completed ? "outline" : "default"}
                disabled={quest.locked}
                onClick={() => startQuest(quest.id)}
              >
                {quest.locked ? (
                  "Locked"
                ) : quest.completed ? (
                  "Replay Quest"
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Quest
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
