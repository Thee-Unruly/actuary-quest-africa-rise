
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, ExternalLink, Calendar, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VirtualSandboxProps {
  userStats: {
    riskCoins: number;
    questsCompleted: number;
    sandboxScore: number;
    communityRank: string;
  };
  setUserStats: (stats: any) => void;
}

interface Article {
  id: string;
  title: string;
  summary?: string;
  published_at?: string;
  source?: string;
  external_url?: string;
  content?: string;
}

export const VirtualSandbox = ({ userStats, setUserStats }: VirtualSandboxProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    // Fetch news articles from supabase
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("news_articles")
        .select("id, title, summary, published_at, source, external_url, content")
        .order("published_at", { ascending: false });
      if (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } else {
        setArticles(data || []);
      }
      setLoading(false);
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        <span className="ml-3 text-orange-500">Loading articles...</span>
      </div>
    );
  }

  if (selectedArticle) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  {selectedArticle.title}
                </CardTitle>
                <CardDescription>
                  {selectedArticle.summary}
                </CardDescription>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  {selectedArticle.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedArticle.published_at.slice(0, 10)}
                    </div>
                  )}
                  {selectedArticle.source && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedArticle.source}
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedArticle(null)}>
                Back to Articles
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-gray-800 whitespace-pre-line mb-3">{selectedArticle.content}</div>
            {selectedArticle.external_url && (
              <Button className="mt-2" size="sm" asChild>
                <a href={selectedArticle.external_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Read full article
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Actuarial News & Articles
          </CardTitle>
          <CardDescription>
            Stay updated with the latest developments in actuarial science, regulations, and industry trends.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length === 0 ? (
          <div className="col-span-full py-8 text-center text-gray-500">
            No news articles available. Please check back later.
          </div>
        ) : (
          articles.map(article => (
            <Card
              key={article.id}
              className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
              onClick={() => setSelectedArticle(article)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{article.title}</CardTitle>
                {article.summary && <CardDescription className="mb-2">{article.summary}</CardDescription>}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  {article.source && <Badge variant="secondary">{article.source}</Badge>}
                  {article.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {article.published_at.slice(0, 10)}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grow flex flex-col justify-end">
                {article.external_url && (
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <a href={article.external_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Read Full Article
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
