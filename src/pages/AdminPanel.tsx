import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Calculator, BookOpen, Newspaper, ArrowLeft } from "lucide-react";
import NewsAdminPanel from "@/components/admin/NewsAdminPanel";

export default function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const loading = authLoading || profileLoading;

  // Evaluate admin status using either role or email for easier dev/admin access
  const isAdmin =
    (profile?.role === "admin") ||
    (user?.email && user.email.toLowerCase() === "admin@gmail.com");

  // Extra debug info
  console.log("AdminPanel: user", user);
  console.log("AdminPanel: profile", profile);
  console.log("AdminPanel: loading", loading);
  console.log("AdminPanel: isAdmin", isAdmin);

  useEffect(() => {
    // If not loading, and not an admin, navigate away immediately.
    if (!loading && (!user || !isAdmin)) {
      navigate("/", { replace: true });
    }
    // No cleanup needed for timeout as it's removed.
  }, [user, profile, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
        <span className="text-orange-500 font-medium">Checking admin access...</span>
        <div className="mt-2 text-xs text-gray-400">
          Auth Loading: {String(authLoading)}<br/>
          Profile Loading: {String(profileLoading)}<br/>
          User: {user?.email || "none"}<br/>
          Profile role: {profile?.role || "none"}<br/>
          isAdmin: {String(isAdmin)}
        </div>
      </div>
    );
  }

  // Explicit error if profile couldn't be found (providing more context)
  if (!loading && !profile && !(user?.email && user.email.toLowerCase() === "admin@gmail.com")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
        <span className="text-red-500 font-medium mb-4">
          Error: No profile was found for this user ({user?.email ?? "unknown"}).<br />
          Please contact support or try re-registering.
        </span>
        {/* Debug block */}
        <div className="bg-white border rounded p-4 my-4 shadow">
          <div className="text-lg font-bold mb-1">DEBUG:</div>
          <div className="text-gray-800 text-sm mb-2">
            <div><b>User Email</b>: {user?.email || "none"}</div>
            <div><b>Profile role</b>: {profile?.role || "none"}</div>
            <div><b>isAdmin</b>: {String(isAdmin)}</div>
            <div><b>loading</b>: {String(loading)}</div>
          </div>
        </div>
        <span className="text-gray-500 text-xs">If you are admin@gmail.com, please contact us if the problem persists.</span>
        <div className="mt-2 text-xs text-gray-400">
          Debug: user = {JSON.stringify(user)}<br/>
          loading = {String(loading)}
        </div>
      </div>
    );
  }

  // Only admins may see the UI
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
        <span className="text-red-500 font-medium mb-4">
          Access Denied. You are not an admin.<br />
          (Logged in as: {user?.email ?? "unknown"})
        </span>
        <div className="bg-white border rounded p-4 my-4 shadow">
          <div className="text-lg font-bold mb-1">DEBUG:</div>
          <div className="text-gray-800 text-sm mb-2">
            <div><b>User Email</b>: {user?.email || "none"}</div>
            <div><b>Profile role</b>: {profile?.role || "none"}</div>
            <div><b>isAdmin</b>: {String(isAdmin)}</div>
            <div><b>loading</b>: {String(loading)}</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Debug: user = {JSON.stringify(user)}<br/>
          profile = {JSON.stringify(profile)}
        </div>
        <div className="mt-8 text-orange-500 text-base font-semibold">
          You will be redirected soon.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Debug info for you */}
        <div className="mb-2 text-xs text-gray-400 flex gap-4">
          <span>Email: {user?.email ?? "unknown"}</span>
          <span>Role: {profile?.role ?? "none"}</span>
          <span>Is Admin: {isAdmin ? "YES" : "NO"}</span>
        </div>

        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded">ADMIN</span>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Welcome, {profile?.full_name || profile?.username || user?.email}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              As an admin, you can manage learning quests, news, and articles from this dashboard.
            </p>
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
