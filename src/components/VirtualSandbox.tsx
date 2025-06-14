
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, ExternalLink, Calendar, Users } from "lucide-react";
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

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author: string;
  external_url: string;
  published_at: string;
  category_id: string;
}

interface NewsCategory {
  id: string;
  name: string;
  description: string;
}

export const VirtualSandbox = ({ userStats, setUserStats }: VirtualSandboxProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedCategory && articles.length > 0) {
      const filtered = articles.filter(article => article.category_id === selectedCategory);
      setCategoryArticles(filtered);
    }
  }, [selectedCategory, articles]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('news_categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getArticlesByCategory = (categoryId: string) => {
    return articles.filter(article => article.category_id === categoryId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Actuarial News & Trends
            </CardTitle>
            <CardDescription>Loading articles...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (selectedCategory) {
    const category = categories.find(cat => cat.id === selectedCategory);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  {category?.name}
                </CardTitle>
                <CardDescription>{category?.description}</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                Back to Categories
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          {categoryArticles.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No articles found in this category yet.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Articles created by admins will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            categoryArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                      {article.summary && (
                        <CardDescription className="mb-3">{article.summary}</CardDescription>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.published_at)}
                        </div>
                        {article.source && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {article.source}
                          </div>
                        )}
                        {article.author && (
                          <Badge variant="outline">{article.author}</Badge>
                        )}
                      </div>
                    </div>
                    {article.external_url && (
                      <Button size="sm" className="ml-4" asChild>
                        <a href={article.external_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Read More
                        </a>
                      </Button>
                    )}
                  </div>
                  {article.content && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {article.content}
                      </div>
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))
          )}
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

      {categories.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No news categories available yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Admins can create categories and articles through the admin panel.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryArticlesCount = getArticlesByCategory(category.id);
            const latestArticle = categoryArticlesCount[0];
            
            return (
              <Card 
                key={category.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {category.name}
                    <Badge variant="secondary">{categoryArticlesCount.length} articles</Badge>
                  </CardTitle>
                  <CardDescription className="mb-4">{category.description}</CardDescription>
                  {latestArticle && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Latest:</div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {latestArticle.title}
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore Category
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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
