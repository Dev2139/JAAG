import { useState, useMemo } from "react";
import { mockAlumni } from "@/lib/mockData";
import { CreatePostCard } from "@/components/CreatePostCard";
import { StoriesBar } from "@/components/StoriesBar";
import { SocialPost } from "@/components/SocialPost";
import { FeedSidebar } from "@/components/FeedSidebar";
import { useAuthContext } from "@/lib/supabase/AuthContext";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([
    {
      id: "1",
      author: {
        name: "Rajesh Kumar",
        house: "Aravali",
        batch: 2018,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh",
      },
      content:
        "Excited to announce that I've been promoted to Senior Software Engineer at Google! Thanks to all the amazing alumni who mentored me over the years. 🚀",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 324,
      comments: 45,
      shares: 12,
      liked: false,
    },
    {
      id: "2",
      author: {
        name: "Priya Sharma",
        house: "Neelgiri",
        batch: 2020,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      },
      content:
        "Just completed my MBA from IIM Ahmedabad! Looking to connect with alumni working in the startup ecosystem. Let's collaborate! 💼",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 198,
      comments: 32,
      shares: 8,
    },
    {
      id: "3",
      author: {
        name: "Arjun Singh",
        house: "Shiwalik",
        batch: 2019,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
      },
      content:
        "Hosting a webinar on 'Building Your Personal Brand in Tech' next week. Free registration for all JNV alumni! Register now 👇",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 156,
      comments: 28,
      shares: 5,
    },
  ]);

  const [stories] = useState([
    {
      id: "1",
      author: { name: "Amit Patel", house: "Udaygiri", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit" },
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop",
      viewed: false,
    },
    {
      id: "2",
      author: { name: "Neha Gupta", house: "Aravali", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=neha" },
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop",
      viewed: false,
    },
    {
      id: "3",
      author: { name: "Rohan Verma", house: "Shiwalik", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohan" },
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop",
      viewed: true,
    },
  ]);

  const onlineAlumni = mockAlumni.slice(0, 8).map((a) => ({
    id: a.id,
    name: a.fullName,
    house: a.house,
    batch: a.batch,
    isOnline: true,
  }));

  const suggestions = mockAlumni.slice(8, 13).map((a) => ({
    id: a.id,
    name: a.fullName,
    house: a.house,
    batch: a.batch,
  }));

  const handlePostCreate = (content: string) => {
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: "You",
        house: "Aravali",
        batch: 2021,
      },
      content,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
    };
    setPosts([newPost, ...posts]);
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Flame className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600 mb-6">Connect with JNV Alumni, share experiences, and grow together</p>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
            <a href="/login">Sign In Now</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Stories */}
            <StoriesBar stories={stories} />

            {/* Create Post */}
            <CreatePostCard onPostCreate={handlePostCreate} />

            {/* Feed */}
            <div>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No posts yet. Be the first to share! 🚀</p>
                </div>
              ) : (
                posts.map((post) => <SocialPost key={post.id} post={post} />)
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <FeedSidebar suggestions={suggestions} onlineAlumni={onlineAlumni} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
