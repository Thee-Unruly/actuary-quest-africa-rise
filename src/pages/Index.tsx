
import { AuthProvider } from "@/components/AuthProvider";
import { AuthPage } from "@/components/AuthPage";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "@/components/DashboardContent";

const Index = () => {
  const { user } = useAuth();
  const { loading } = useProfile();

  if (!user || loading) return <AuthPage />;

  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
};

export default Index;
