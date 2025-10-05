import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryFilter } from "./CategoryFilter";
import { useState, useEffect } from "react";

export const BlogList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedState, setSelectedState] = useState<string>();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', selectedCategory, selectedCountry, selectedState],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          comments(count)
        `)
        .order('published_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
      if (selectedCountry) {
        query = query.eq('country_id', selectedCountry);
      }
      if (selectedState) {
        query = query.eq('state_id', selectedState);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      return data;
    }
  });

  // Real-time subscription for new posts
  useEffect(() => {
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        () => {
          // Refetch posts when new ones are added
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading posts. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No posts available</h3>
        <p className="text-muted-foreground">Check back soon for the latest news updates!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryFilter
        selectedCategory={selectedCategory}
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        onCategoryChange={setSelectedCategory}
        onCountryChange={setSelectedCountry}
        onStateChange={setSelectedState}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            image_url={post.image_url}
            slug={post.slug}
            author={post.author}
            published_at={post.published_at}
            views={post.views}
            commentCount={Array.isArray(post.comments) ? post.comments.length : 0}
          />
        ))}
      </div>
    </div>
  );
};