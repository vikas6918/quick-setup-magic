import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CommentsSection } from "@/components/CommentsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  const incrementViewsMutation = useMutation({
    mutationFn: async (postSlug: string) => {
      const { error } = await supabase.rpc('increment_post_views', { 
        post_slug: postSlug 
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', slug] });
    }
  });

  useEffect(() => {
    if (post && slug) {
      incrementViewsMutation.mutate(slug);
    }
  }, [post?.slug]); // Only run when post ID changes

  // Real-time subscription for view updates
  useEffect(() => {
    if (!slug) return;

    const channel = supabase
      .channel(`post-${slug}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `slug=eq.${slug}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['post', slug] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, queryClient]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="flex-1">
              <Skeleton className="h-8 w-32 mb-6" />
              <Skeleton className="aspect-video w-full mb-6" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="w-80">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const publishedDate = new Date(post.published_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate comprehensive SEO keywords based on post content
  const generateKeywords = (title: string, description: string, tags: string[] = []) => {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    const text = `${title} ${description}`.toLowerCase();
    const words = text.match(/\b\w{4,}\b/g) || [];
    const uniqueWords = [...new Set(words)]
      .filter(word => !commonWords.includes(word))
      .slice(0, 8);
    
    const baseKeywords = ['India news', 'Indian current affairs', 'PulseIndia', 'latest news India', 'breaking news'];
    const contentKeywords = [...uniqueWords, ...tags.slice(0, 5)];
    
    return [...baseKeywords, ...contentKeywords].join(', ');
  };

  const keywords = generateKeywords(post.title, post.description || '', post.tags || []);
  const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;
  const metaDescription = post.description 
    ? (post.description.length > 155 ? post.description.substring(0, 152) + '...' : post.description)
    : `Read latest news about ${post.title.substring(0, 100)}... on PulseIndia`;
  
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "description": post.description,
    "image": post.image_url ? [post.image_url] : undefined,
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "PulseIndia",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/favicon.ico`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleSection": "News",
    "keywords": post.tags?.join(', ') || keywords
  };

  return (
    <>
      <Helmet>
        <title>{post.title} - PulseIndia</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={post.author} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Article specific meta tags */}
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:modified_time" content={post.updated_at} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content="News" />
        {post.tags && <meta property="article:tag" content={post.tags.join(', ')} />}
        
        {/* Open Graph tags */}
        <meta property="og:title" content={`${post.title} - PulseIndia`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="PulseIndia" />
        <meta property="og:locale" content="en_IN" />
        {post.image_url && (
          <>
            <meta property="og:image" content={post.image_url} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={post.title} />
          </>
        )}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@PulseIndia" />
        <meta name="twitter:creator" content={`@${post.author}`} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={metaDescription} />
        {post.image_url && <meta name="twitter:image" content={post.image_url} />}
        
        {/* Additional SEO tags */}
        <meta name="news_keywords" content={keywords} />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="DC.language" content="en" />
        <meta name="DC.title" content={post.title} />
        <meta name="DC.creator" content={post.author} />
        <meta name="DC.subject" content={keywords} />
        <meta name="DC.description" content={metaDescription} />
        
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <article>
                {post.image_url && (
                  <div className="aspect-video mb-6 overflow-hidden rounded-lg">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <header className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{publishedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views} views</span>
                    </div>
                    <Badge variant="secondary">
                      {post.author}
                    </Badge>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </header>

                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-lg leading-relaxed">{post.description}</p>
                </div>
                <CommentsSection postid={post.id}/>
              </article>
            </main>

            <aside className="w-full lg:w-80">
              <Sidebar />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};