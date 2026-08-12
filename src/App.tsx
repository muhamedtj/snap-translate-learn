import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import ScanPage from "@/pages/ScanPage";
import StudyPage from "@/pages/StudyPage";
import VocabularyPage from "@/pages/VocabularyPage";
import ProfilePage from "@/pages/ProfilePage";
import ResultPage from "@/pages/ResultPage";
import SettingsPage from "@/pages/SettingsPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidebar from "@/components/ChatSidebar";
import Onboarding, { ONBOARDING_KEY } from "@/components/Onboarding";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem(ONBOARDING_KEY)
  );

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <ChatSidebar />
        <main className="flex-1 relative overflow-x-hidden">
          <div className="w-full max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl mx-auto min-h-screen relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/result/:id" element={<ResultPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <div className="md:hidden">
              <BottomNav />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

