import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { BlogDetail } from "./pages/BlogDetail";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import CricketScores from "./pages/CricketScores";
import MatchDetail from "./pages/MatchDetail";
import Astrology from "./pages/Astrology";

const queryClient = new QueryClient();

const App = () => {
  // Google Analytics
  useEffect(() => {
    // Load GA script dynamically
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-HER3TM9RP4";
    script.async = true;
    document.head.appendChild(script);

    // Initialize GA
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", "G-HER3TM9RP4");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cricket-scores" element={<CricketScores />} />
            <Route path="/match/:matchId" element={<MatchDetail />} />
            <Route path="/astrology" element={<Astrology />} />
            <Route path="/contact-us" element={<ContactUs />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />            
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
