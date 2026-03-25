import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader, ArrowLeft, Mail, Facebook, Instagram, Linkedin, MessageCircle, Phone } from "lucide-react";
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
  phone?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  whatsapp_number?: string;
  show_contact_number: boolean;
  show_whatsapp: boolean;
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

            {/* Social Media Section */}
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Connect</h2>
              <div className="space-y-4">
                {/* Facebook */}
                {profile.facebook_url && (
                  <div className="flex items-center gap-3">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <a
                      href={profile.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Facebook
                    </a>
                  </div>
                )}

                {/* Instagram */}
                {profile.instagram_url && (
                  <div className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <a
                      href={profile.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Instagram
                    </a>
                  </div>
                )}

                {/* LinkedIn */}
                {profile.linkedin_url && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-blue-700" />
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}

                {/* Phone */}
                {profile.show_contact_number && profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <a href={`tel:${profile.phone}`} className="text-blue-600 hover:underline">
                      {profile.phone}
                    </a>
                  </div>
                )}

                {/* WhatsApp */}
                {profile.show_contact_number && profile.show_whatsapp && profile.whatsapp_number && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    <a
                      href={`https://wa.me/${profile.whatsapp_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}

                {/* Email */}
                {profile.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-red-600" />
                    <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                      {profile.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
