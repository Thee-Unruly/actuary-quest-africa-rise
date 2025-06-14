
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, ExternalLink, Calendar, Users } from "lucide-react";

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
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = {
    "IFRS 17": {
      description: "The new international accounting standard for insurance contracts",
      articles: [
        {
          title: "IFRS 17 Implementation Timeline Extended to 2025",
          summary: "Key updates on the extended implementation timeline and what insurers need to know",
          link: "https://example.com/ifrs17-timeline",
          date: "2024-06-10",
          source: "Insurance Journal"
        },
        {
          title: "Practical Guide to IFRS 17 Transition Adjustments",
          summary: "Step-by-step approach to handling transition adjustments under the new standard",
          link: "https://example.com/ifrs17-transition",
          date: "2024-06-08",
          source: "KPMG Insights"
        },
        {
          title: "Technology Solutions for IFRS 17 Compliance",
          summary: "How insurtech is helping companies prepare for IFRS 17 requirements",
          link: "https://example.com/ifrs17-tech",
          date: "2024-06-05",
          source: "Actuarial Post"
        }
      ]
    },
    "Climate Risk": {
      description: "Emerging trends in climate risk modeling and actuarial applications",
      articles: [
        {
          title: "AI-Powered Climate Risk Models Transform Insurance Pricing",
          summary: "Machine learning algorithms are revolutionizing how insurers assess climate-related risks",
          link: "https://example.com/climate-ai",
          date: "2024-06-12",
          source: "Risk Management Magazine"
        },
        {
          title: "TCFD Reporting Requirements for Insurance Companies",
          summary: "New climate disclosure requirements and their impact on actuarial valuations",
          link: "https://example.com/tcfd-insurance",
          date: "2024-06-09",
          source: "Environmental Finance"
        },
        {
          title: "Catastrophe Modeling in the Era of Extreme Weather",
          summary: "How actuaries are adapting cat models for increasingly unpredictable weather patterns",
          link: "https://example.com/cat-modeling",
          date: "2024-06-07",
          source: "Casualty Actuarial Society"
        }
      ]
    },
    "Digital Transformation": {
      description: "Technology adoption and digital innovation in actuarial science",
      articles: [
        {
          title: "Blockchain Applications in Insurance Claim Processing",
          summary: "How distributed ledger technology is streamlining claims and reducing fraud",
          link: "https://example.com/blockchain-claims",
          date: "2024-06-11",
          source: "InsurTech Weekly"
        },
        {
          title: "Real-Time Data Analytics in Underwriting",
          summary: "The shift from traditional to real-time risk assessment using IoT and telematics",
          link: "https://example.com/realtime-underwriting",
          date: "2024-06-06",
          source: "Digital Insurance"
        },
        {
          title: "API-First Approach to Actuarial Systems",
          summary: "Building flexible, scalable actuarial platforms for the digital age",
          link: "https://example.com/api-actuarial",
          date: "2024-06-04",
          source: "Actuarial Review"
        }
      ]
    },
    "Regulatory Updates": {
      description: "Latest regulatory changes affecting actuarial practice globally",
      articles: [
        {
          title: "Solvency II Review: Key Changes for 2024",
          summary: "European regulators announce significant updates to capital requirements",
          link: "https://example.com/solvency-ii-2024",
          date: "2024-06-13",
          source: "European Insurance Journal"
        },
        {
          title: "US State Insurance Reforms Impact Pricing Models",
          summary: "How new state regulations are changing actuarial assumptions and methodologies",
          link: "https://example.com/us-insurance-reforms",
          date: "2024-06-10",
          source: "NAIC Quarterly"
        },
        {
          title: "Global Pension Reform Trends and Actuarial Implications",
          summary: "Cross-border analysis of pension system changes and their actuarial impact",
          link: "https://example.com/pension-reforms",
          date: "2024-06-08",
          source: "Pension & Investments"
        }
      ]
    },
    "Machine Learning": {
      description: "AI and ML applications transforming actuarial modeling",
      articles: [
        {
          title: "Neural Networks in Mortality Forecasting",
          summary: "Deep learning models outperform traditional life tables in longevity prediction",
          link: "https://example.com/neural-mortality",
          date: "2024-06-12",
          source: "Journal of Actuarial Practice"
        },
        {
          title: "Explainable AI in Insurance Pricing",
          summary: "Balancing model accuracy with regulatory transparency requirements",
          link: "https://example.com/explainable-ai",
          date: "2024-06-09",
          source: "AI in Insurance"
        },
        {
          title: "Automated Claim Fraud Detection Using ML",
          summary: "How machine learning is revolutionizing fraud prevention in insurance",
          link: "https://example.com/ml-fraud-detection",
          date: "2024-06-07",
          source: "Fraud Magazine"
        }
      ]
    }
  };

  const topicKeys = Object.keys(topics);

  if (selectedTopic && topics[selectedTopic as keyof typeof topics]) {
    const topic = topics[selectedTopic as keyof typeof topics];
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  {selectedTopic}
                </CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedTopic(null)}>
                Back to Topics
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          {topic.articles.map((article, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                    <CardDescription className="mb-3">{article.summary}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {article.source}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="ml-4" asChild>
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Read More
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Actuarial News & Trends
          </CardTitle>
          <CardDescription>
            Stay updated with the latest developments in actuarial science, regulations, and industry trends
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topicKeys.map((topicKey) => {
          const topic = topics[topicKey as keyof typeof topics];
          return (
            <Card key={topicKey} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedTopic(topicKey)}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  {topicKey}
                  <Badge variant="secondary">{topic.articles.length} articles</Badge>
                </CardTitle>
                <CardDescription className="mb-4">{topic.description}</CardDescription>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Latest:</div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {topic.articles[0].title}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore Topic
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
    </div>
  );
};
