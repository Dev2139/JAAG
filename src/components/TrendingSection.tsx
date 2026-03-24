import React from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface TrendingTopic {
  id: string;
  category: string;
  title: string;
  posts: number;
  icon?: string;
}

export const TrendingSection = () => {
  const trends: TrendingTopic[] = [
    {
      id: '1',
      category: 'Careers',
      title: '#TechJobs',
      posts: 12400,
    },
    {
      id: '2',
      category: 'Education',
      title: '#IIMAlumni',
      posts: 8900,
    },
    {
      id: '3',
      category: 'Startups',
      title: '#FounderLife',
      posts: 7500,
    },
    {
      id: '4',
      category: 'Mentoring',
      title: '#MentorshipProgram',
      posts: 6200,
    },
    {
      id: '5',
      category: 'Networking',
      title: '#AlumniConnects',
      posts: 5800,
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="p-4 border-0 shadow-md">
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search Twitter..."
            className="pl-10 bg-gray-100 border-0 rounded-full placeholder:text-gray-500"
          />
        </div>
      </Card>

      <Card className="border-0 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold text-xl text-gray-900">What's Trending</h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {trends.map((trend, idx) => (
            <button
              key={trend.id}
              className="w-full px-4 py-3 hover:bg-gray-50 transition text-left"
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-500">{trend.category} • Trending</p>
                <p className="font-bold text-gray-900 text-base">{trend.title}</p>
                <p className="text-sm text-gray-500">{trend.posts.toLocaleString()} posts</p>
              </div>
            </button>
          ))}
        </div>

        <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 font-semibold py-3">
          Show more
        </Button>
      </Card>
    </div>
  );
};
