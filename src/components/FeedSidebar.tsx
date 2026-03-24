import React from 'react';
import { UserPlus, Dot, MessageCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Alumni {
  id: string;
  name: string;
  house: string;
  batch: number;
  avatar?: string;
  isOnline?: boolean;
  isFriend?: boolean;
}

interface SidebarProps {
  suggestions: Alumni[];
  onlineAlumni: Alumni[];
  onAddFriend?: (alumni: Alumni) => void;
  onMessage?: (alumni: Alumni) => void;
}

export const FeedSidebar: React.FC<SidebarProps> = ({
  suggestions,
  onlineAlumni,
  onAddFriend,
  onMessage,
}) => {
  return (
    <div className="space-y-6">
      {/* Online Friends */}
      <Card className="p-4 border-0 shadow-md">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Dot className="h-4 w-4 text-green-500 fill-green-500" />
          Online ({onlineAlumni.length})
        </h3>
        <div className="space-y-3">
          {onlineAlumni.map((alumni) => (
            <div key={alumni.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={alumni.avatar} />
                    <AvatarFallback>{alumni.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{alumni.name}</p>
                  <p className="text-xs text-gray-500">{alumni.house}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => onMessage?.(alumni)}
              >
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Friend Suggestions */}
      <Card className="p-4 border-0 shadow-md">
        <h3 className="font-bold text-gray-900 mb-4">Suggestions For You</h3>
        <div className="space-y-3">
          {suggestions.map((alumni) => (
            <div key={alumni.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={alumni.avatar} />
                  <AvatarFallback>{alumni.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{alumni.name}</p>
                  <p className="text-xs text-gray-500">{alumni.house} • Batch {alumni.batch}</p>
                </div>
              </div>
              <Button
                size="sm"
                className="flex-shrink-0 gap-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => onAddFriend?.(alumni)}
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer Info */}
      <div className="px-4 py-3 text-gray-600 text-xs space-y-2">
        <div className="flex gap-2 flex-wrap">
          <a href="#" className="hover:underline">
            About
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Help
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Privacy
          </a>
        </div>
        <p>© 2026 JNV Alumni Connect</p>
      </div>
    </div>
  );
};
