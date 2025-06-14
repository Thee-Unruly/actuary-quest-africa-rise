
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const IndustryInsights = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="text-lg">Industry Insights</CardTitle>
        <CardDescription>
          Quick facts and trends shaping the actuarial profession
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">75%</div>
            <div className="text-sm text-gray-600">of insurers are investing in AI and ML for risk assessment</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">$2.1T</div>
            <div className="text-sm text-gray-600">global insurance market size expected by 2025</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
