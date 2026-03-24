import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader, ArrowLeft, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string;
  batch_year: number;
  profession: string;
  company_name: string;
  current_city: string;
  house: string;
  profile_image_url: string | null;
  help_offered: string[];
  bio: string;
  email: string;
  migration_jnv: string;
}

export default function ProfileView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      setCurrentUser(user.user?.id || null);
    };

    getCurrentUser();
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
      navigate("/directory");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectClick = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // For demo, we'll just show a toast. In production, send actual message
    toast({
      title: "Message Sent",
      description: `Connection request sent to ${profile?.full_name}!`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Profile not found</p>
          <Button onClick={() => navigate("/directory")}>Back to Directory</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/directory")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Directory
        </Button>

        <Card className="overflow-hidden">
          {/* Cover Background */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />

          {/* Profile Content */}
          <div className="px-6 py-8">
            {/* Avatar & Name */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 border-4 border-white -mt-16 mb-4">
                  <AvatarImage src={profile.profile_image_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.full_name}
                </h1>

                <div className="space-y-2 mb-4">
                  <p className="text-lg font-semibold text-blue-600">
                    {profile.profession}
                  </p>
                  <p className="text-gray-600">{profile.company_name}</p>
                  <p className="text-sm text-gray-500">📍 {profile.current_city}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>{profile.house}</Badge>
                  <Badge variant="outline">Batch {profile.batch_year}</Badge>
                </div>

                <Button
                  onClick={handleConnectClick}
                  className="gap-2"
                  size="lg"
                >
                  <Mail className="h-4 w-4" />
                  Connect
                </Button>
              </div>
            </div>

            <hr className="my-8" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* About Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Email
                    </p>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      House
                    </p>
                    <p className="text-gray-900">{profile.house}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Batch Year
                    </p>
                    <p className="text-gray-900">{profile.batch_year}</p>
                  </div>
                  {profile.migration_jnv && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Migration JNV
                      </p>
                      <p className="text-gray-900">{profile.migration_jnv}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Help Offered Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  How I Can Help
                </h2>
                {profile.help_offered && profile.help_offered.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.help_offered.map((help) => (
                      <Badge key={help} className="bg-blue-100 text-blue-700">
                        {help}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Not specified</p>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bio</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
