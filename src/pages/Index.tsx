
import { AuthProvider } from "@/components/AuthProvider";
import { AuthPage } from "@/components/AuthPage";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "@/components/DashboardContent";
import React from "react";

const IndexContent = () => {
  const { user } = useAuth();
  const { loading } = useProfile();

  if (!user || loading) return <AuthPage />;

  return <DashboardContent />;
};

const Index = () => (
  <AuthProvider>
    <IndexContent />
  </AuthProvider>
);

export default Index;
