import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, Calendar, Share2 } from "lucide-react";import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";



interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  slug: string;
  author: string;
  published_at: string;
  views: number;
  commentCount?: number;
}

export const BlogCard = ({ 
  title, 
  description, 
  image_url, 
  slug, 
  author, 
  published_at, 
  views,
  commentCount = 0 
}: BlogCardProps) => {
  const { toast } = useToast();
  const publishedDate = new Date(published_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: title,
      text: description,
      url: `${window.location.origin}/blog/${slug}`,
      ...(image_url && { files: [] }) // Will be handled by the browser
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${title}\n${shareData.url}`);
        toast({
          title: "Link copied!",
          description: "Post link has been copied to clipboard",
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: "Share failed",
          description: "Unable to share this post",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/blog/${slug}`}>
        {image_url && (
          <div className="aspect-video overflow-hidden">
            <img 
              src={image_url} 
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {description}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="pt-0 space-y-2">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>{publishedDate}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {author}
          </Badge>
        </div>
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{commentCount}</span>
          </div>
        </div>
        <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-auto p-1 hover:bg-accent"
            title="Share post"
          >
            <Share2 className="h-3 w-3" />
          </Button>
      </CardFooter>
    </Card>
  );
};
