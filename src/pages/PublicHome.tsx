import { useState } from "react";
import { Plus, Users, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockAlumni } from "@/lib/mockData";
import { getHouseColor } from "@/lib/houseThemes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Alumni {
  id: string;
  fullName: string;
  batch: number;
  house: string;
  profession: string;
  companyName: string;
  currentCity: string;
  bio: string;
  email?: string;
}

interface Post {
  id: string;
  author: {
    name: string;
    house: string;
    batch: number;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
}

const PublicHome = () => {
  const [alumni, setAlumni] = useState<Alumni[]>(mockAlumni);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([
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
      liked: false,
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
      liked: false,
    },
  ]);

  const [newAlumni, setNewAlumni] = useState({
    fullName: "",
    email: "",
    batch: new Date().getFullYear() - 2015,
    house: "Aravali",
    profession: "",
    companyName: "",
    currentCity: "",
    bio: "",
  });

  const [newPost, setNewPost] = useState("");
  const [posterName, setPosterName] = useState("");
  const [posterHouse, setPosterHouse] = useState("Aravali");

  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHouse = !selectedHouse || a.house === selectedHouse;

    return matchesSearch && matchesHouse;
  });

  const handleAddAlumni = () => {
    if (!newAlumni.fullName || !newAlumni.email) {
      toast({
        title: "Error",
        description: "Please fill in name and email",
        variant: "destructive",
      });
      return;
    }

    const alumniItem: Alumni = {
      id: `alumni-${Date.now()}`,
      ...newAlumni,
    };

    setAlumni([...alumni, alumniItem]);
    setNewAlumni({
      fullName: "",
      email: "",
      batch: new Date().getFullYear() - 2015,
      house: "Aravali",
      profession: "",
      companyName: "",
      currentCity: "",
      bio: "",
    });

    toast({
      title: "✨ Success!",
      description: "You've been added to the alumni network!",
    });
  };

  const handlePostCreate = () => {
    if (!newPost.trim() || !posterName) {
      toast({
        title: "Error",
        description: "Please enter your name and post content",
        variant: "destructive",
      });
      return;
    }

    const post: Post = {
      id: `post-${Date.now()}`,
      author: {
        name: posterName,
        house: posterHouse,
        batch: 2020,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${posterName}`,
      },
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      liked: false,
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setPosterName("");

    toast({
      title: "✨ Posted!",
      description: "Your message is now live!",
    });
  };

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const housesOptions = ["Aravali", "Neelgiri", "Shiwalik", "Udaygiri"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-12 sticky top-16 z-40 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">JNV Alumni Community</h1>
          <p className="text-blue-100 mb-6">Connect, Share & Grow Together</p>
          
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-blue-200" />
                <Input
                  placeholder="Search alumni, companies, locations..."
                  className="pl-12 rounded-lg bg-white/90 text-gray-900 placeholder:text-gray-600 border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <select
              value={selectedHouse || ""}
              onChange={(e) => setSelectedHouse(e.target.value || null)}
              className="px-4 py-2.5 border-0 rounded-lg bg-white/90 text-gray-900 font-medium"
            >
              <option value="">All Houses</option>
              {housesOptions.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>

            {/* Action Buttons */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold">
                  <Plus className="h-5 w-5" />
                  <span>Add Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join the Alumni Network</DialogTitle>
                  <DialogDescription>Share your profile with other JNV alumni</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        value={newAlumni.fullName}
                        onChange={(e) =>
                          setNewAlumni({ ...newAlumni, fullName: e.target.value })
                        }
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={newAlumni.email}
                        onChange={(e) =>
                          setNewAlumni({ ...newAlumni, email: e.target.value })
                        }
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Batch</Label>
                      <Input
                        type="number"
                        value={newAlumni.batch}
                        onChange={(e) =>
                          setNewAlumni({
                            ...newAlumni,
                            batch: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>House</Label>
                      <Select
                        value={newAlumni.house}
                        onValueChange={(value) =>
                          setNewAlumni({ ...newAlumni, house: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {housesOptions.map((house) => (
                            <SelectItem key={house} value={house}>
                              {house}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Current Profession</Label>
                    <Input
                      value={newAlumni.profession}
                      onChange={(e) =>
                        setNewAlumni({ ...newAlumni, profession: e.target.value })
                      }
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div>
                    <Label>Company</Label>
                    <Input
                      value={newAlumni.companyName}
                      onChange={(e) =>
                        setNewAlumni({ ...newAlumni, companyName: e.target.value })
                      }
                      placeholder="e.g., Google"
                    />
                  </div>

                  <div>
                    <Label>City</Label>
                    <Input
                      value={newAlumni.currentCity}
                      onChange={(e) =>
                        setNewAlumni({ ...newAlumni, currentCity: e.target.value })
                      }
                      placeholder="e.g., Bangalore"
                    />
                  </div>

                  <div>
                    <Label>About You</Label>
                    <Textarea
                      value={newAlumni.bio}
                      onChange={(e) =>
                        setNewAlumni({ ...newAlumni, bio: e.target.value })
                      }
                      placeholder="Share your journey..."
                      className="min-h-20"
                    />
                  </div>

                  <Button
                    onClick={handleAddAlumni}
                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Add Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-white/20 text-white hover:bg-white/30 border border-white rounded-lg font-semibold">
                  <MessageSquare className="h-5 w-5" />
                  <span>Post Update</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share with Alumni</DialogTitle>
                  <DialogDescription>Post an update or opportunity</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Your Name</Label>
                      <Input
                        value={posterName}
                        onChange={(e) => setPosterName(e.target.value)}
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <Label>House</Label>
                      <Select value={posterHouse} onValueChange={setPosterHouse}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {housesOptions.map((house) => (
                            <SelectItem key={house} value={house}>
                              {house}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your thoughts, opportunities, or updates..."
                      className="min-h-24"
                    />
                  </div>

                  <Button
                    onClick={handlePostCreate}
                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Post Now
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Alumni Grid - Left */}
          <div className="xl:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Connect with Alumni</h2>
              <p className="text-gray-600">
                {filteredAlumni.length} alumni in network
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max max-h-[calc(100vh-200px)] overflow-y-auto">
              {filteredAlumni.length === 0 ? (
                <p className="text-gray-500 py-8 text-center col-span-2">No alumni found</p>
              ) : (
                filteredAlumni.map((a) => {
                  const houseColor = getHouseColor(a.house);
                  return (
                    <Card
                      key={a.id}
                      className="p-4 hover:shadow-lg transition-all cursor-pointer border-0 bg-white"
                    >
                      <div className="flex flex-col items-center text-center">
                        <Avatar
                          className="h-16 w-16 mb-3"
                          style={{ borderColor: houseColor.primary, borderWidth: "3px" }}
                        >
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.fullName}`} />
                          <AvatarFallback>{a.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <p className="font-bold text-sm truncate w-full">{a.fullName}</p>
                        {a.profession && (
                          <p className="text-xs text-gray-600 mb-1">{a.profession}</p>
                        )}
                        <p className="text-xs text-gray-500 mb-3">
                          {a.companyName}
                          {a.currentCity && ` • ${a.currentCity}`}
                        </p>

                        <div className="flex gap-1.5 justify-center flex-wrap w-full">
                          <Badge
                            className="text-xs"
                            style={{ backgroundColor: houseColor.light, color: houseColor.primary }}
                          >
                            {a.house}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {a.batch}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Posts Feed - Right */}
          <div className="xl:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Community Feed</h2>
              <p className="text-gray-600">
                {posts.length} recent updates
              </p>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {posts.map((post) => {
                const houseColor = getHouseColor(post.author.house);
                return (
                  <Card
                    key={post.id}
                    className="p-6 hover:shadow-lg transition-all border-0 bg-white"
                  >
                    {/* Post Header */}
                    <div className="flex gap-4 mb-4">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm">{post.author.name}</p>
                            <div className="flex gap-2 flex-wrap mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{ borderColor: houseColor.primary, color: houseColor.primary }}
                              >
                                {post.author.house}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {post.author.batch}
                              </Badge>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTime(post.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm leading-relaxed text-gray-800 mb-4 break-words">
                      {post.content}
                    </p>

                    {/* Post Actions */}
                    <div
                      className="flex gap-6 pt-3 border-t text-xs"
                      style={{ borderTopColor: houseColor.light }}
                    >
                      <button
                        onClick={() => toggleLike(post.id)}
                        className="flex items-center gap-2 transition-colors group"
                      >
                        <div
                          className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                          style={{
                            backgroundColor: post.liked ? houseColor.primary : "transparent",
                            border: `2px solid ${houseColor.primary}`,
                          }}
                        >
                          {post.liked && (
                            <span className="text-white text-xs font-bold">♥</span>
                          )}
                        </div>
                        <span className="text-gray-600 font-semibold">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group">
                        <div className="h-7 w-7 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-blue-600 group-hover:scale-110 transition-all flex-shrink-0">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-semibold">Reply</span>
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicHome;
