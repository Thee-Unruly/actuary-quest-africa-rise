
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

interface ArticleForm {
  id?: string;
  title: string;
  summary: string;
  content: string;
  source?: string;
  published_at?: string;
}

export default function NewsAdminPanel() {
  const [editingArticle, setEditingArticle] = useState<ArticleForm | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ["admin-news-articles"],
    queryFn: async () => {
      let { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Create or update article
  const mutation = useMutation({
    mutationFn: async (form: ArticleForm) => {
      console.log('Submitting article data:', form);
      
      const articleData = {
        title: form.title,
        summary: form.summary || null,
        content: form.content || null,
        source: form.source || null,
      };

      if (form.id) {
        // Update
        const { data, error } = await supabase
          .from("news_articles")
          .update(articleData)
          .eq("id", form.id)
          .select()
          .single();
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        return data;
      } else {
        // Create
        const { data, error } = await supabase
          .from("news_articles")
          .insert([articleData])
          .select()
          .single();
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news-articles"] });
      setShowForm(false);
      setEditingArticle(null);
      toast.success(editingArticle ? 'Article updated successfully!' : 'Article created successfully!');
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to save article: ${error.message}`);
    }
  });

  // Delete article
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news_articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news-articles"] });
      toast.success('Article deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast.error(`Failed to delete article: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    const article: ArticleForm = {
      id: editingArticle?.id,
      title: fd.get("title") as string,
      summary: fd.get("summary") as string,
      content: fd.get("content") as string,
      source: fd.get("source") as string,
    };

    console.log('Form submission data:', article);
    mutation.mutate(article);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage News & Articles</CardTitle>
          <Button variant="outline" onClick={() => { setShowForm(true); setEditingArticle(null); }}>
            <Plus className="w-4 h-4 mr-1" />
            Add New Article
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500" />
            </div>
          )}
          {!isLoading && (!articles || articles.length === 0) && (
            <div className="py-6 text-center text-gray-500">No news articles found.</div>
          )}
          {!isLoading && articles && articles.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {articles.map((a: any) => (
                <Card key={a.id} className="border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base mb-1">{a.title}</CardTitle>
                      {a.source && <Badge className="bg-orange-100 text-orange-600">{a.source}</Badge>}
                      <div className="text-xs text-gray-500 mt-1">{a.published_at?.slice(0, 10)}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => { setEditingArticle(a); setShowForm(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => deleteMutation.mutate(a.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium text-gray-700 mb-2">{a.summary}</div>
                    <div className="text-xs text-gray-500">{a.content?.substring(0, 80)}...</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingArticle?.id ? "Edit Article" : "Add New Article"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input 
                required 
                name="title" 
                defaultValue={editingArticle?.title || ""} 
                placeholder="Title" 
              />
              <Input 
                name="source" 
                defaultValue={editingArticle?.source || ""} 
                placeholder="Source" 
              />
              <Textarea 
                name="summary" 
                rows={2} 
                defaultValue={editingArticle?.summary || ""} 
                placeholder="Summary" 
              />
              <Textarea 
                name="content" 
                rows={4} 
                defaultValue={editingArticle?.content || ""} 
                placeholder="Content (optional)" 
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                  {mutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingArticle(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
