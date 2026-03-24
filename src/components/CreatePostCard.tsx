import React from 'react';
import { Image, Smile, MapPin, Send } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '@/lib/supabase/AuthContext';

interface CreatePostProps {
  onPostCreate?: (content: string) => void;
}

export const CreatePostCard: React.FC<CreatePostProps> = ({ onPostCreate }) => {
  const { user } = useAuthContext();
  const [content, setContent] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onPostCreate?.(content);
      setContent('');
      setIsExpanded(false);
    }
  };

  return (
    <Card className="mb-6 p-4 border-0 shadow-md">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src="" />
          <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {!isExpanded ? (
            <Input
              placeholder="What's on your mind?"
              className="rounded-full bg-gray-100 border-0"
              onClick={() => setIsExpanded(true)}
              readOnly
            />
          ) : (
            <div className="space-y-3">
              <Textarea
                placeholder="What's on your mind?"
                className="border border-gray-300 rounded-lg resize-none"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoFocus
              />

              <div className="flex gap-2 pb-2 border-b border-gray-200">
                <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
                  <Image className="h-5 w-5" />
                  <span className="hidden sm:inline">Photo</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
                  <Smile className="h-5 w-5" />
                  <span className="hidden sm:inline">Feeling</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span className="hidden sm:inline">Location</span>
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsExpanded(false);
                    setContent('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                >
                  <Send className="h-4 w-4" />
                  Post
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
