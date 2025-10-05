import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Eye, User, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const ArticleDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", post?.id],
    queryFn: async () => {
      if (!post?.id) return [];
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", post.id)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!post?.id,
  });

  useEffect(() => {
    if (slug) {
      supabase.rpc("increment_post_views", { post_slug: slug });
    }
  }, [slug]);

  const addCommentMutation = useMutation({
    mutationFn: async (data: { user_name: string; comment_text: string; post_id: string }) => {
      const { error } = await supabase.from("comments").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post?.id] });
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully.",
      });
      setUserName("");
      setCommentText("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post?.id || !userName.trim() || !commentText.trim()) return;

    addCommentMutation.mutate({
      user_name: userName,
      comment_text: commentText,
      post_id: post.id,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {post.category_id && (
            <Badge className="mb-4">
              {typeof post.category === 'object' && post.category && 'name' in post.category 
                ? String((post.category as any).name) 
                : 'News'}
            </Badge>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <span className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.views.toLocaleString()} views</span>
            </span>
          </div>

          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          {post.description && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.description}
            </p>
          )}

          {post.content && (
            <div className="prose prose-lg max-w-none mb-12">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <MessageSquare className="h-6 w-6" />
              <span>Comments ({comments?.length || 0})</span>
            </h2>

            <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
              <Input
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <Textarea
                placeholder="Write your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                required
              />
              <Button type="submit" disabled={addCommentMutation.isPending}>
                {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </form>

            <div className="space-y-6">
              {comments?.map((comment) => (
                <div key={comment.id} className="border-l-2 border-primary pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold">{comment.user_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{comment.comment_text}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
