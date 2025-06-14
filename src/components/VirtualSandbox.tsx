
import { useState, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NewsCategories } from "./NewsCategories";
import { CategoryArticles } from "./CategoryArticles";
import { IndustryInsights } from "./IndustryInsights";

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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
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
      <CategoryArticles 
        category={category}
        articles={categoryArticles}
        onBackToCategories={handleBackToCategories}
      />
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

      <NewsCategories 
        categories={categories}
        articles={articles}
        onCategorySelect={handleCategorySelect}
      />

      <IndustryInsights />
    </div>
  );
};
