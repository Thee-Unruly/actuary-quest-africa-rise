
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Calculator, BookOpen, Newspaper } from "lucide-react";
import NewsAdminPanel from "@/components/admin/NewsAdminPanel";

export default function AdminPanel() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const navigate = useNavigate();

  // Debug logs to help diagnose blank admin panel
  console.log("AdminPanel: user", user);
  console.log("AdminPanel: profile", profile);
  console.log("AdminPanel: loading", loading);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      console.log("AdminPanel: Not admin or not logged in, navigating to /");
      navigate("/", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  // Show `Checking admin access...` if loading OR during profile fetch
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <span className="text-orange-500 font-medium">Checking admin access...</span>
      </div>
    );
  }

  // Explicit error if profile couldn't be found
  if (!loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <span className="text-red-500 font-medium">
          Error: No profile was found for this user. Please contact support or try re-registering.
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded">ADMIN</span>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Welcome, {profile.full_name || profile.username || user?.email}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">As an admin, you can manage learning quests, news, and articles from this dashboard.</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="quests" className="w-full">
          <TabsList>
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learning Quests
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              News & Articles
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quests">
            <div className="mt-6">
              {/* Placeholder for learning quests management */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Learning Quests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Here you will be able to <span className="font-medium">add, edit, and remove learning quests</span>.
                    (Feature coming soon!)
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="news">
            <div className="mt-6">
              <NewsAdminPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
