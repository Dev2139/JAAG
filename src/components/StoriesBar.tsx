import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getHouseColor } from '@/lib/houseThemes';

interface Story {
  id: string;
  author: {
    name: string;
    house: string;
    avatar?: string;
  };
  image: string;
  viewed?: boolean;
}

interface StoriesProps {
  stories: Story[];
  onStoryClick?: (storyId: string) => void;
}

export const StoriesBar: React.FC<StoriesProps> = ({ stories, onStoryClick }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative mb-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide" ref={scrollRef}>
          {/* Create Story Button */}
          <Button
            variant="outline"
            size="lg"
            className="flex-shrink-0 flex flex-col items-center gap-2 h-32 w-24"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium">Your Story</span>
          </Button>

          {/* Stories */}
          {stories.map((story) => {
            const houseColor = getHouseColor(story.author.house);
            return (
              <button
                key={story.id}
                onClick={() => onStoryClick?.(story.id)}
                className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden relative group cursor-pointer"
              >
                <img
                  src={story.image}
                  alt={story.author.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

                {/* Story Ring */}
                <div
                  className="absolute top-2 left-2 p-0.5 rounded-full"
                  style={{ background: story.viewed ? '#d1d5db' : houseColor.primary }}
                >
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={story.author.avatar} />
                    <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold truncate">
                  {story.author.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
