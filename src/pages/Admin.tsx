
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, BookOpen, Newspaper, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { AuthPage } from "@/components/AuthPage";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("quests");

  // Quest form state
  const [questForm, setQuestForm] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    estimated_time: "",
    reward_coins: 0,
    content: ""
  });

  // News form state
  const [newsForm, setNewsForm] = useState({
    title: "",
    summary: "",
    content: "",
    source: "",
    author: "",
    external_url: ""
  });

  // Data lists
  const [quests, setQuests] = useState([]);
  const [news, setNews] = useState([]);

  if (!user) {
    return <AuthPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Settings className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin (for now, we'll allow all users - you can add role checking later)
  if (profile?.role !== 'admin' && profile?.role !== 'instructor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need admin or instructor privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleQuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('quests')
        .insert([{
          title: questForm.title,
          description: questForm.description,
          difficulty: questForm.difficulty,
          estimated_time: questForm.estimated_time,
          reward_coins: questForm.reward_coins,
          content: { type: "text", data: questForm.content }
        }]);

      if (error) throw error;
      
      toast({
        title: "Quest created successfully!",
        description: "The new quest has been added to the system.",
      });
      
      setQuestForm({
        title: "",
        description: "",
        difficulty: "beginner",
        estimated_time: "",
        reward_coins: 0,
        content: ""
      });
      
      fetchQuests();
    } catch (error) {
      console.error('Error creating quest:', error);
      toast({
        title: "Error creating quest",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('news_articles')
        .insert([{
          title: newsForm.title,
          summary: newsForm.summary,
          content: newsForm.content,
          source: newsForm.source,
          author: newsForm.author,
          external_url: newsForm.external_url,
          published_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      toast({
        title: "News article created successfully!",
        description: "The new article has been added to the system.",
      });
      
      setNewsForm({
        title: "",
        summary: "",
        content: "",
        source: "",
        author: "",
        external_url: ""
      });
      
      fetchNews();
    } catch (error) {
      console.error('Error creating news:', error);
      toast({
        title: "Error creating news article",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchQuests = async () => {
    const { data } = await supabase
      .from('quests')
      .select('*')
      .order('created_at', { ascending: false });
    setQuests(data || []);
  };

  const fetchNews = async () => {
    const { data } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false });
    setNews(data || []);
  };

  const deleteQuest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Quest deleted successfully!",
      });
      
      fetchQuests();
    } catch (error) {
      console.error('Error deleting quest:', error);
      toast({
        title: "Error deleting quest",
        variant: "destructive",
      });
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "News article deleted successfully!",
      });
      
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "Error deleting news",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchQuests();
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Manage quests, news, and content</p>
              </div>
            </div>
            
            <Button onClick={() => window.location.href = "/"} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learning Quests
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              News & Articles
            </TabsTrigger>
          </TabsList>

          {/* Quests Tab */}
          <TabsContent value="quests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Quest Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Quest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleQuestSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="quest-title">Title</Label>
                      <Input
                        id="quest-title"
                        value={questForm.title}
                        onChange={(e) => setQuestForm({...questForm, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="quest-description">Description</Label>
                      <Textarea
                        id="quest-description"
                        value={questForm.description}
                        onChange={(e) => setQuestForm({...questForm, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quest-difficulty">Difficulty</Label>
                        <Select
                          value={questForm.difficulty}
                          onValueChange={(value) => setQuestForm({...questForm, difficulty: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="quest-time">Estimated Time</Label>
                        <Input
                          id="quest-time"
                          value={questForm.estimated_time}
                          onChange={(e) => setQuestForm({...questForm, estimated_time: e.target.value})}
                          placeholder="e.g., 30 minutes"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="quest-coins">Reward Coins</Label>
                      <Input
                        id="quest-coins"
                        type="number"
                        value={questForm.reward_coins}
                        onChange={(e) => setQuestForm({...questForm, reward_coins: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="quest-content">Content</Label>
                      <Textarea
                        id="quest-content"
                        value={questForm.content}
                        onChange={(e) => setQuestForm({...questForm, content: e.target.value})}
                        rows={4}
                        placeholder="Quest content, instructions, or questions..."
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Quest
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quests List */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Quests ({quests.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {quests.map((quest: any) => (
                      <div key={quest.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{quest.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{quest.difficulty}</Badge>
                              <Badge variant="outline">{quest.reward_coins} coins</Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteQuest(quest.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create News Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create News Article
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewsSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="news-title">Title</Label>
                      <Input
                        id="news-title"
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="news-summary">Summary</Label>
                      <Textarea
                        id="news-summary"
                        value={newsForm.summary}
                        onChange={(e) => setNewsForm({...newsForm, summary: e.target.value})}
                        rows={2}
                        placeholder="Brief summary of the article..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="news-content">Content</Label>
                      <Textarea
                        id="news-content"
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                        rows={4}
                        placeholder="Full article content..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="news-source">Source</Label>
                        <Input
                          id="news-source"
                          value={newsForm.source}
                          onChange={(e) => setNewsForm({...newsForm, source: e.target.value})}
                          placeholder="e.g., Actuarial Post"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="news-author">Author</Label>
                        <Input
                          id="news-author"
                          value={newsForm.author}
                          onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                          placeholder="Author name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="news-url">External URL (optional)</Label>
                      <Input
                        id="news-url"
                        type="url"
                        value={newsForm.external_url}
                        onChange={(e) => setNewsForm({...newsForm, external_url: e.target.value})}
                        placeholder="https://example.com/article"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Article
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* News List */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Articles ({news.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {news.map((article: any) => (
                      <div key={article.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{article.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                            <div className="flex gap-2">
                              {article.source && <Badge variant="secondary">{article.source}</Badge>}
                              {article.author && <Badge variant="outline">{article.author}</Badge>}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteNews(article.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
