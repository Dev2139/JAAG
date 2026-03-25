import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  phone?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  whatsapp_number?: string;
  show_whatsapp: boolean;
  profile_password: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { id: profileId } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    batch_year: 0,
    profession: "",
    company_name: "",
    current_city: "",
    bio: "",
    migration_jnv: "",
    show_contact_number: true,
    phone: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    whatsapp_number: "",
    show_whatsapp: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        if (!profileId) {
          toast({
            title: "Error",
            description: "Profile ID not found",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileId)
          .single();

        if (error) throw error;

        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          batch_year: data.batch_year || 0,
          profession: data.profession || "",
          company_name: data.company_name || "",
          current_city: data.current_city || "",
          bio: data.bio || "",
          migration_jnv: data.migration_jnv || "",
          show_contact_number: data.show_contact_number ?? true,
          phone: data.phone || "",
          facebook_url: data.facebook_url || "",
          instagram_url: data.instagram_url || "",
          linkedin_url: data.linkedin_url || "",
          whatsapp_number: data.whatsapp_number || "",
          show_whatsapp: data.show_whatsapp ?? true,
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
  }, [profileId, navigate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate batch year
    if (formData.batch_year < 2006) {
      toast({
        title: "Error",
        description: "Batch year must be 2006 or later",
        variant: "destructive",
      });
      return;
    }

    setShowPasswordDialog(true);
    setEnteredPassword("");
    setPasswordError("");
  };

  const verifyAndUpdate = async () => {
    if (!enteredPassword) {
      setPasswordError("Please enter your profile password");
      return;
    }

    // Validate batch year
    if (formData.batch_year < 2006) {
      setPasswordError("Batch year must be 2006 or later");
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
          batch_year: formData.batch_year,
          profession: formData.profession,
          company_name: formData.company_name,
          current_city: formData.current_city,
          bio: formData.bio,
          migration_jnv: formData.migration_jnv,
          show_contact_number: formData.show_contact_number,
          phone: formData.phone,
          facebook_url: formData.facebook_url,
          instagram_url: formData.instagram_url,
          linkedin_url: formData.linkedin_url,
          whatsapp_number: formData.whatsapp_number,
          show_whatsapp: formData.show_whatsapp,
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

            {/* Batch Year */}
            <div>
              <Label htmlFor="batch_year" className="block text-sm font-medium text-gray-900 mb-2">
                Batch Year (Minimum 2006)
              </Label>
              <Input
                id="batch_year"
                type="number"
                value={formData.batch_year}
                onChange={(e) => handleInputChange("batch_year", parseInt(e.target.value) || 0)}
                className="h-10 rounded-lg"
                min="2006"
              />
              {formData.batch_year < 2006 && formData.batch_year > 0 && (
                <p className="text-xs text-red-600 mt-1">Batch year must be 2006 or later</p>
              )}
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

            {/* Social Media Links */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Social Media & Contact</h3>
              
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                  Phone / WhatsApp Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="h-10 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="facebook_url" className="block text-sm font-medium text-gray-900 mb-2">
                  Facebook URL
                </Label>
                <Input
                  id="facebook_url"
                  value={formData.facebook_url}
                  onChange={(e) => handleInputChange("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/yourprofile"
                  className="h-10 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="instagram_url" className="block text-sm font-medium text-gray-900 mb-2">
                  Instagram URL
                </Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url || ""}
                  onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                  className="h-10 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-900 mb-2">
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url || ""}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="h-10 rounded-lg"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-900 mb-2">
                  WhatsApp Number
                </Label>
                <Input
                  id="whatsapp_number"
                  value={formData.whatsapp_number || ""}
                  onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="h-10 rounded-lg"
                />
              </div>
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

            {/* WhatsApp Visibility Toggle */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg opacity-50" style={{ opacity: !formData.show_contact_number ? 0.5 : 1 }}>
              <Checkbox
                id="show_whatsapp"
                checked={formData.show_whatsapp}
                onCheckedChange={(checked) =>
                  handleInputChange("show_whatsapp", checked)
                }
                disabled={!formData.show_contact_number}
              />
              <div className="flex-1">
                <Label htmlFor="show_whatsapp" className="text-sm cursor-pointer font-normal text-gray-700">
                  Let others see my WhatsApp details
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  {!formData.show_contact_number 
                    ? "Enable 'Let others see my phone number' to show WhatsApp details"
                    : "Other alumni will be able to see your WhatsApp number if enabled"}
                </p>
              </div>
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
