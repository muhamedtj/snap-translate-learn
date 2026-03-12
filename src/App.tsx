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
import NotFound from "./pages/NotFound";
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
    <div className="max-w-lg mx-auto relative">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
