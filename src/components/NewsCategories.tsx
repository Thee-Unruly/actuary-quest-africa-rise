
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface NewsCategory {
  id: string;
  name: string;
  description: string;
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

interface NewsCategoriesProps {
  categories: NewsCategory[];
  articles: NewsArticle[];
  onCategorySelect: (categoryId: string) => void;
}

export const NewsCategories = ({ categories, articles, onCategorySelect }: NewsCategoriesProps) => {
  const getArticlesByCategory = (categoryId: string) => {
    return articles.filter(article => article.category_id === categoryId);
  };

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No news categories available yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Admins can create categories and articles through the admin panel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const categoryArticlesCount = getArticlesByCategory(category.id);
        const latestArticle = categoryArticlesCount[0];
        
        return (
          <Card 
            key={category.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => onCategorySelect(category.id)}
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
  );
};
