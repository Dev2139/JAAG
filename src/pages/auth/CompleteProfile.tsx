import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Loader } from "lucide-react";

const HELP_OFFERED_OPTIONS = [
  "Mentorship",
  "Career Guidance",
  "Job Opportunities",
  "Project Collaboration",
  "Internship Opportunities",
  "Technical Support",
  "Business Advice",
  "Interview Preparation",
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedHelp, setSelectedHelp] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    full_name: "",
    batch_year: new Date().getFullYear() - 2015,
    house: "Aravali",
    migration_jnv: "",
    profession: "",
    company_name: "",
    current_city: "",
    bio: "",
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be less than 5MB", variant: "destructive" });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File, userId: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(`profiles/${fileName}`, file, { upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("profile-images")
      .getPublicUrl(`profiles/${fileName}`);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.full_name ||
      !formData.profession ||
      !formData.company_name ||
      !formData.current_city
    ) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, user.user.id);
      }

      const profileData = {
        id: user.user.id,
        ...formData,
        help_offered: selectedHelp,
        profile_image_url: imageUrl,
        email: user.user.email,
      };

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.user.id)
        .single();

      if (existingProfile) {
        const { error } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("id", user.user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("profiles").insert([profileData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Profile completed! Awaiting admin approval...",
      });

      setTimeout(() => {
        navigate("/directory");
      }, 1500);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to complete profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleHelp = (option: string) => {
    setSelectedHelp((prev) =>
      prev.includes(option) ? prev.filter((h) => h !== option) : [...prev, option]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-4 py-12">
      <Card className="w-full max-w-2xl mx-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">Help other alumni find and connect with you</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview || undefined} />
                <AvatarFallback>{formData.full_name.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={loading}
                />
                <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">Upload Photo</span>
                </div>
              </label>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your name"
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Batch Year *</Label>
                <Input
                  type="number"
                  value={formData.batch_year}
                  onChange={(e) =>
                    setFormData({ ...formData, batch_year: parseInt(e.target.value) })
                  }
                  disabled={loading}
                />
              </div>
            </div>

            {/* House & Migration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>House *</Label>
                <Select value={formData.house} onValueChange={(v) => setFormData({ ...formData, house: v })}>
                  <SelectTrigger disabled={loading}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aravali">Aravali</SelectItem>
                    <SelectItem value="Nilgiri">Nilgiri</SelectItem>
                    <SelectItem value="Shivalik">Shivalik</SelectItem>
                    <SelectItem value="Udaygiri">Udaygiri</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Migration JNV</Label>
                <Input
                  value={formData.migration_jnv}
                  onChange={(e) => setFormData({ ...formData, migration_jnv: e.target.value })}
                  placeholder="e.g., JNV Jaipur"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Career Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Profession *</Label>
                <Input
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Company *</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g., Google"
                  disabled={loading}
                />
              </div>
            </div>

            {/* City & Bio */}
            <div>
              <Label>Current City *</Label>
              <Input
                value={formData.current_city}
                onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                placeholder="e.g., Bangalore"
                disabled={loading}
              />
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Help Offered */}
            <div>
              <Label className="mb-3 block">How Can You Help Other Alumni?</Label>
              <div className="grid grid-cols-2 gap-2">
                {HELP_OFFERED_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleHelp(option)}
                    disabled={loading}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      selectedHelp.includes(option)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full" size="lg" disabled={loading}>
              {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
