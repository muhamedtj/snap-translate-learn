import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <ChatSidebar />
            <main className="flex-1 relative overflow-x-hidden">
              <div className="max-w-lg mx-auto min-h-screen relative">
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

