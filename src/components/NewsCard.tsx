import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  published_at: string;
  slug: string;
  views: number;
  category?: {
    name: string;
    slug: string;
  };
  featured?: boolean;
}

export const NewsCard = ({
  title,
  description,
  image_url,
  published_at,
  slug,
  views,
  category,
  featured = false,
}: NewsCardProps) => {
  return (
    <Link to={`/article/${slug}`}>
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 h-full ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}>
        <div className={`relative ${featured ? "h-96" : "h-48"}`}>
          <img
            src={image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"}
            alt={title}
            className="w-full h-full object-cover"
          />
          {category && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              {category.name}
            </Badge>
          )}
        </div>
        <CardContent className="p-6">
          <h3 className={`font-bold mb-2 line-clamp-2 hover:text-primary transition-colors ${
            featured ? "text-2xl" : "text-lg"
          }`}>
            {title}
          </h3>
          {description && (
            <p className={`text-muted-foreground mb-4 ${
              featured ? "line-clamp-3" : "line-clamp-2"
            }`}>
              {description}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(published_at), { addSuffix: true })}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{views.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
