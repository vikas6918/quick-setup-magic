import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewsCard } from "@/components/NewsCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

const Index = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(name, slug)
        `)
        .order("published_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(name, slug)
        `)
        .order("views", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4">
                Stay Updated with <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">PulseIndia</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Your trusted source for breaking news, analysis, and insights
              </p>
            </div>
          </div>
        </section>

        {/* Trending News */}
        {trending && trending.length > 0 && (
          <section className="container mx-auto px-4 py-8">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {trending.map((post, index) => (
                <div key={post.id} className="flex items-start space-x-3">
                  <span className="text-4xl font-bold text-primary/20">{index + 1}</span>
                  <div>
                    <a href={`/article/${post.slug}`} className="font-semibold hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Latest News Grid */}
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Latest News</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.map((post, index) => (
                <NewsCard
                  key={post.id}
                  {...post}
                  category={typeof post.category === 'object' && post.category !== null ? post.category : undefined}
                  featured={index === 0}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
