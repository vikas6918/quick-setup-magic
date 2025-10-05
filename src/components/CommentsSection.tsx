import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Reply, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  comment_text: string;
  user_name: string;
  created_at: string;
  parent_comment_id?: string;
  replies?: Comment[];
}

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organize comments into threaded structure
      const commentsMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      data.forEach(comment => {
        const commentWithReplies = { ...comment, replies: [] };
        commentsMap.set(comment.id, commentWithReplies);

        if (!comment.parent_comment_id) {
          rootComments.push(commentWithReplies);
        }
      });

      data.forEach(comment => {
        if (comment.parent_comment_id) {
          const parent = commentsMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies!.push(commentsMap.get(comment.id)!);
          }
        }
      });

      return rootComments;
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ text, name, parentId }: { text: string; name: string; parentId?: string }) => {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          comment_text: text,
          user_name: name,
          parent_comment_id: parentId || null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setCommentText("");
      setReplyText("");
      setReplyingTo(null);
      toast({
        title: "Success",
        description: "Your comment has been posted!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    
    const text = parentId ? replyText : commentText;
    
    if (!text.trim() || !userName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    addCommentMutation.mutate({ text, name: userName, parentId });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const commentDate = new Date(comment.created_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div className={`border-l-2 border-muted pl-4 ${isReply ? 'ml-6' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.user_name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{commentDate}</span>
          </div>
          <p className="text-sm">{comment.comment_text}</p>
          
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-xs h-8"
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
          )}

          {replyingTo === comment.id && (
            <form onSubmit={(e) => handleSubmit(e, comment.id)} className="space-y-3 mt-3">
              <Textarea
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  <Send className="w-3 h-3 mr-1" />
                  Reply
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments ({comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0)})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
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
            className="min-h-[100px]"
            required
          />
          <Button type="submit" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-2" />
            Post Comment
          </Button>
        </form>

        {/* Comments List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};