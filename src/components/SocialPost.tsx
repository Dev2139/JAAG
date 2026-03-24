import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getHouseColor } from '@/lib/houseThemes';

interface Post {
  id: string;
  author: {
    name: string;
    house: string;
    batch: number;
    avatar?: string;
  };
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
}

interface SocialPostProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export const SocialPost: React.FC<SocialPostProps> = ({ post, onLike, onComment }) => {
  const houseColor = getHouseColor(post.author.house);
  const [isLiked, setIsLiked] = React.useState(post.liked || false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  return (
    <Card className="mb-4 overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2" style={{ borderColor: houseColor.primary }}>
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span style={{ color: houseColor.primary }} className="font-medium">
                {post.author.house}
              </span>
              <span>•</span>
              <span>Batch {post.author.batch}</span>
              <span>•</span>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="w-full">
          <img src={post.image} alt="Post" className="w-full max-h-96 object-cover" />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between text-sm text-gray-600">
        <span>{post.likes} likes</span>
        <span>{post.comments} comments</span>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 flex gap-2">
        <Button
          variant="ghost"
          className="flex-1 gap-2"
          onClick={handleLike}
        >
          <Heart
            className="h-5 w-5"
            fill={isLiked ? houseColor.primary : 'none'}
            color={isLiked ? houseColor.primary : 'currentColor'}
          />
          <span>Like</span>
        </Button>
        <Button variant="ghost" className="flex-1 gap-2" onClick={() => onComment?.(post.id)}>
          <MessageCircle className="h-5 w-5" />
          <span>Comment</span>
        </Button>
        <Button variant="ghost" className="flex-1 gap-2">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </Button>
      </div>
    </Card>
  );
};
