import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewsCard } from "@/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: posts, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(name, slug)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-8 w-8 text-primary" />
              <h1 className="text-5xl font-bold">Search Results</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              {query ? `Showing results for "${query}"` : "Enter a search query"}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
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
          ) : posts && posts.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Found {posts.length} article{posts.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <NewsCard
                    key={post.id}
                    {...post}
                    category={post.category as any}
                  />
                ))}
              </div>
            </>
          ) : query ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No articles found matching your search.
              </p>
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
