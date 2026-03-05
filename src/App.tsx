import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/pages/HomePage";
import LibraryPage from "@/pages/LibraryPage";
import SnapWordsPage from "@/pages/SnapWordsPage";
import WordsPage from "@/pages/WordsPage";
import StudySessionPage from "@/pages/StudySessionPage";
import ProfilePage from "@/pages/ProfilePage";
import ScanPage from "@/pages/ScanPage";
import ResultPage from "@/pages/ResultPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-lg mx-auto relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/snap/:id" element={<SnapWordsPage />} />
            <Route path="/words" element={<WordsPage />} />
            <Route path="/study" element={<StudySessionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/result/:id" element={<ResultPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
