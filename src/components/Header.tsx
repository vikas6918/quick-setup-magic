import { Button } from "@/components/ui/button";
import { RefreshCw, Menu, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const fetchNewsMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-news');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "News fetched successfully!",
      });
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch news",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsRefreshing(false);
    }
  });

  const handleFetchNews = () => {
    setIsRefreshing(true);
    fetchNewsMutation.mutate();
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            PulseIndia
          </Link>
          
          <nav className="hidden sm:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/cricket-scores" className="text-foreground hover:text-primary transition-colors">
              Cricket Scores
            </Link>
            <Link to="/astrology" className="text-foreground hover:text-primary transition-colors">
              Today's Astrology
            </Link>
            <Link to="/contact-us" className="text-foreground hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleFetchNews}
              disabled={isRefreshing}
              variant="outline"
              size="icon"
              title={isRefreshing ? 'Fetching...' : 'Fetch News'}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="sm:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link 
                    to="/" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/cricket-scores" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cricket Scores
                  </Link>
                  <Link 
                    to="/astrology" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Today's Astrology
                  </Link>
                  <Link 
                    to="/contact-us" 
                    className="text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
