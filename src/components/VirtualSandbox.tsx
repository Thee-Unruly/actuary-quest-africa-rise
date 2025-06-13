
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface VirtualSandboxProps {
  userStats: {
    riskCoins: number;
    questsCompleted: number;
    sandboxScore: number;
    communityRank: string;
  };
  setUserStats: (stats: any) => void;
}

export const VirtualSandbox = ({ userStats, setUserStats }: VirtualSandboxProps) => {
  const [premiumRate, setPremiumRate] = useState([1500]);
  const [deductible, setDeductible] = useState([500]);
  const [results, setResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const premium = premiumRate[0];
    const deduct = deductible[0];
    
    // Simplified actuarial calculations
    const expectedClaims = 1200; // Average claims cost per driver
    const fixedCosts = 200; // Administrative costs
    const expectedProfit = premium - expectedClaims - fixedCosts;
    const lossRatio = (expectedClaims / premium) * 100;
    const profitMargin = (expectedProfit / premium) * 100;
    
    // Generate sample data for 100 drivers
    const drivers = Array.from({ length: 100 }, (_, i) => {
      const hasClaim = Math.random() < 0.15; // 15% claim rate
      const claimAmount = hasClaim ? Math.random() * 5000 + 500 : 0;
      const actualProfit = premium - claimAmount - fixedCosts - (hasClaim ? deduct : 0);
      
      return {
        driver: i + 1,
        premium,
        claimAmount: Math.round(claimAmount),
        profit: Math.round(actualProfit),
        hasClaim
      };
    });
    
    const totalPremiums = drivers.reduce((sum, d) => sum + d.premium, 0);
    const totalClaims = drivers.reduce((sum, d) => sum + d.claimAmount, 0);
    const totalProfit = drivers.reduce((sum, d) => sum + d.profit, 0);
    
    // Chart data for visualization
    const chartData = [
      { name: 'Premiums Collected', value: totalPremiums, fill: '#22c55e' },
      { name: 'Claims Paid', value: totalClaims, fill: '#ef4444' },
      { name: 'Net Profit', value: totalProfit, fill: totalProfit > 0 ? '#3b82f6' : '#f59e0b' }
    ];
    
    setResults({
      totalPremiums,
      totalClaims,
      totalProfit,
      lossRatio: (totalClaims / totalPremiums) * 100,
      profitMargin: (totalProfit / totalPremiums) * 100,
      chartData,
      driversWithClaims: drivers.filter(d => d.hasClaim).length
    });
    
    // Calculate score based on performance
    let score = 50; // Base score
    if (totalProfit > 0) score += 30;
    if (lossRatio < 70) score += 20;
    if (lossRatio > 90) score -= 20;
    
    score = Math.max(0, Math.min(100, score));
    
    if (score > userStats.sandboxScore) {
      setUserStats({
        ...userStats,
        sandboxScore: score
      });
      toast.success(`New high score: ${score}%! 🎉`);
    }
    
    setIsRunning(false);
  };

  const getPerformanceFeedback = () => {
    if (!results) return null;
    
    const { lossRatio, profitMargin } = results;
    
    if (profitMargin > 10) {
      return {
        type: "success",
        message: "Excellent! Your pricing strategy is profitable and sustainable.",
        icon: <TrendingUp className="w-5 h-5" />
      };
    } else if (profitMargin > 0) {
      return {
        type: "warning", 
        message: "Good start! Consider slight adjustments to improve profitability.",
        icon: <AlertCircle className="w-5 h-5" />
      };
    } else {
      return {
        type: "error",
        message: "Your pricing is too low! Increase premiums or deductibles to avoid losses.",
        icon: <TrendingDown className="w-5 h-5" />
      };
    }
  };

  const feedback = getPerformanceFeedback();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" />
            Virtual Actuarial Sandbox
          </CardTitle>
          <CardDescription>
            Experiment with insurance pricing for 100 virtual drivers and see the financial impact
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Controls</CardTitle>
            <CardDescription>Adjust variables and run the simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Annual Premium per Driver</Label>
              <p className="text-sm text-gray-600 mb-3">
                Higher premiums increase revenue but may reduce customer acquisition
              </p>
              <Slider
                value={premiumRate}
                onValueChange={setPremiumRate}
                max={3000}
                min={800}
                step={50}
                className="mt-2"
              />
              <div className="text-center mt-2 font-bold text-xl text-blue-600">
                ${premiumRate[0].toLocaleString()}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Deductible Amount</Label>
              <p className="text-sm text-gray-600 mb-3">
                Higher deductibles reduce claim costs but may impact customer satisfaction
              </p>
              <Slider
                value={deductible}
                onValueChange={setDeductible}
                max={2000}
                min={250}
                step={50}
                className="mt-2"
              />
              <div className="text-center mt-2 font-bold text-xl text-green-600">
                ${deductible[0].toLocaleString()}
              </div>
            </div>

            <Button 
              onClick={runSimulation} 
              disabled={isRunning}
              className="w-full bg-blue-500 hover:bg-blue-600"
              size="lg"
            >
              {isRunning ? "Running Simulation..." : "Run Simulation"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              Financial outcomes for your pricing strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${results.totalPremiums.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Premiums</div>
                  </div>
                  
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      ${results.totalClaims.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Claims Paid</div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className={`text-2xl font-bold ${results.totalProfit > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      ${results.totalProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Net Profit</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {results.driversWithClaims}
                    </div>
                    <div className="text-sm text-gray-600">Drivers with Claims</div>
                  </div>
                </div>

                {/* Performance Indicators */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Loss Ratio:</span>
                    <Badge variant={results.lossRatio < 70 ? "default" : results.lossRatio < 85 ? "secondary" : "destructive"}>
                      {results.lossRatio.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Profit Margin:</span>
                    <Badge variant={results.profitMargin > 5 ? "default" : results.profitMargin > 0 ? "secondary" : "destructive"}>
                      {results.profitMargin.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                {/* AI Feedback */}
                {feedback && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${
                    feedback.type === 'success' ? 'bg-green-50 border border-green-200' :
                    feedback.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <div className={
                      feedback.type === 'success' ? 'text-green-600' :
                      feedback.type === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }>
                      {feedback.icon}
                    </div>
                    <p className="text-sm">{feedback.message}</p>
                  </div>
                )}

                {/* Simple Chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Run a simulation to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
