import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, TrendingUp } from "lucide-react";
export const Sidebar = () => {
  const { data: latestPosts, isLoading: isLoadingLatest } = useQuery({
    queryKey: ['latest-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, published_at, author')
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  const { data: trendingPosts, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, views, published_at, author')
        .order('views', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  const PostSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Latest Posts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Latest Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingLatest ? (
            <>
              {Array(5).fill(0).map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </>
          ) : (
            latestPosts?.map((post) => (
              <div key={post.id} className="space-y-1">
                <Link 
                  to={`/blog/${post.slug}`}
                  className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {post.author}
                  </Badge>
                  <span>
                    {new Date(post.published_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Trending Posts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trending Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingTrending ? (
            <>
              {Array(5).fill(0).map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </>
          ) : (
            trendingPosts?.map((post) => (
              <div key={post.id} className="space-y-1">
                <Link 
                  to={`/blog/${post.slug}`}
                  className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {post.author}
                  </Badge>
                  <span>{post.views} views</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};