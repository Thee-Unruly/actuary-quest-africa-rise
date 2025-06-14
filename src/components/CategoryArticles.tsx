
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Users, ExternalLink } from "lucide-react";

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

interface CategoryArticlesProps {
  category: NewsCategory | undefined;
  articles: NewsArticle[];
  onBackToCategories: () => void;
}

export const CategoryArticles = ({ category, articles, onBackToCategories }: CategoryArticlesProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
            <Button variant="outline" onClick={onBackToCategories}>
              Back to Categories
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {articles.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No articles found in this category yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Articles created by admins will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          articles.map((article) => (
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
};
