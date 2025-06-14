
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Coins, Calculator, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";

export const DashboardHeader = ({ userStats }: { userStats: any }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Actuarial Hub</h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name || user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {profile?.role === "admin" && (
            <a
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm font-medium shadow"
            >
              <Calculator className="w-4 h-4" />
              Admin Panel
            </a>
          )}
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-gray-900">{userStats.riskCoins}</span>
            <span className="text-sm text-gray-600">Risk Coins</span>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-orange-500 text-white">
              {profile?.full_name?.split(' ').map(n => n[0]).join('') || user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
