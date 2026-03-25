import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader } from "lucide-react";
import { verifyProfilePassword } from "@/lib/passwordUtils";

interface Profile {
  id: string;
  full_name: string;
  batch_year: number;
  house: string;
  profession: string;
  company_name: string;
  current_city: string;
  bio: string;
  migration_jnv: string;
  profile_image_url: string | null;
  help_offered: string[];
  show_contact_number: boolean;
  profile_password: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    profession: "",
    company_name: "",
    current_city: "",
    bio: "",
    migration_jnv: "",
    show_contact_number: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: user } = await supabase.auth.getUser();

        if (!user.user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          profession: data.profession || "",
          company_name: data.company_name || "",
          current_city: data.current_city || "",
          bio: data.bio || "",
          migration_jnv: data.migration_jnv || "",
          show_contact_number: data.show_contact_number ?? true,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasswordDialog(true);
    setEnteredPassword("");
    setPasswordError("");
  };

  const verifyAndUpdate = async () => {
    if (!enteredPassword) {
      setPasswordError("Please enter your profile password");
      return;
    }

    if (!profile || !verifyProfilePassword(enteredPassword, profile.profile_password)) {
      setPasswordError("Incorrect profile password");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          profession: formData.profession,
          company_name: formData.company_name,
          current_city: formData.current_city,
          bio: formData.bio,
          migration_jnv: formData.migration_jnv,
          show_contact_number: formData.show_contact_number,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      setShowPasswordDialog(false);
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
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
          onClick={() => navigate("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="full_name" className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>

            {/* Profession */}
            <div>
              <Label htmlFor="profession" className="block text-sm font-medium text-gray-900 mb-2">
                Profession
              </Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => handleInputChange("profession", e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>

            {/* Company Name */}
            <div>
              <Label htmlFor="company_name" className="block text-sm font-medium text-gray-900 mb-2">
                Company Name
              </Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>

            {/* Current City */}
            <div>
              <Label htmlFor="current_city" className="block text-sm font-medium text-gray-900 mb-2">
                Current City
              </Label>
              <Input
                id="current_city"
                value={formData.current_city}
                onChange={(e) => handleInputChange("current_city", e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>

            {/* Migration JNV */}
            <div>
              <Label htmlFor="migration_jnv" className="block text-sm font-medium text-gray-900 mb-2">
                Migration JNV
              </Label>
              <Input
                id="migration_jnv"
                value={formData.migration_jnv}
                onChange={(e) => handleInputChange("migration_jnv", e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>

            {/* Contact Visibility Toggle */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Checkbox
                id="show_contact"
                checked={formData.show_contact_number}
                onCheckedChange={(checked) =>
                  handleInputChange("show_contact_number", checked)
                }
              />
              <Label htmlFor="show_contact" className="text-sm cursor-pointer font-normal text-gray-700">
                Let others see my phone number
              </Label>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="block text-sm font-medium text-gray-900 mb-2">
                Bio / About
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="rounded-lg resize-none"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 rounded-lg"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Password Verification Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Profile Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              To update your profile, please enter your profile password for security verification.
            </p>

            <div>
              <Label htmlFor="profile_password" className="block text-sm font-medium text-gray-900 mb-2">
                Profile Password
              </Label>
              <Input
                id="profile_password"
                type="password"
                placeholder="Enter your profile password"
                value={enteredPassword}
                onChange={(e) => {
                  setEnteredPassword(e.target.value);
                  setPasswordError("");
                }}
                className="h-10 rounded-lg"
              />
              {passwordError && (
                <p className="text-sm text-red-600 mt-1">{passwordError}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={verifyAndUpdate}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {saving ? "Verifying..." : "Verify & Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
