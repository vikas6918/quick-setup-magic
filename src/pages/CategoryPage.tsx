import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewsCard } from "@/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryPage = () => {
  const { slug } = useParams();

  const { data: category } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["category-posts", slug],
    queryFn: async () => {
      if (!category?.id) return [];
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq("category_id", category.id)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!category?.id,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">{category?.name}</h1>
            {category?.description && (
              <p className="text-xl text-muted-foreground">{category.description}</p>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <NewsCard
                  key={post.id}
                  {...post}
                  category={post.category as any}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No articles found in this category.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
