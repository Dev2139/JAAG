import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Upload, Loader, ArrowLeft, Lock, Shield } from "lucide-react";

export default function AddProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    batch_year: new Date().getFullYear() - 2015,
    house: "Aravali",
    profession: "",
    company_name: "",
    current_city: "",
    email: "",
    phone: "",
    bio: "",
    instagram_url: "",
    linkedin_url: "",
    whatsapp_number: "",
    show_contact_number: true,
    profile_password: "",
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setImagePreview(imageData);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };


  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    formDataObj.append("upload_preset", "jnv_alumni");
    formDataObj.append("cloud_name", "dsddldquo");

    const response = await fetch("https://api.cloudinary.com/v1_1/dsddldquo/image/upload", {
      method: "POST",
      body: formDataObj,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.full_name || !formData.profession || !formData.company_name || !formData.current_city) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!formData.profile_password) {
        toast({
          title: "Error",
          description: "Profile password is required for future profile updates",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      let imageUrl = null;

      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      // Insert into database
      const { error } = await supabase.from("alumni").insert([
        {
          full_name: formData.full_name,
          batch_year: formData.batch_year,
          house: formData.house,
          profession: formData.profession,
          company_name: formData.company_name,
          current_city: formData.current_city,
          email: formData.email || null,
          phone: formData.phone || null,
          bio: formData.bio || null,
          profile_image_url: imageUrl,
          instagram_url: formData.instagram_url || null,
          linkedin_url: formData.linkedin_url || null,
          whatsapp_number: formData.whatsapp_number || null,
          show_contact_number: formData.show_contact_number,
          profile_password: formData.profile_password,
        },
      ]);

      if (error) throw error;

      toast({ title: "Success", description: "Your profile has been added!" });

      // Navigate back to home
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black shadow-lg border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <img 
              src="https://res.cloudinary.com/dsddldquo/image/upload/v1774335593/aq0jncwikmvjmt90rpxy.png" 
              alt="JAAG Logo" 
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold text-white">JAAG</h1>
              <p className="text-sm text-gray-300">JNV Association of Alumni Gandhinagar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6 border-2 border-black"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Directory
        </Button>

        {/* Form Card */}
        <Card className="p-8 bg-gray-100 border-4 border-black">
          <h2 className="text-3xl font-bold text-black mb-2">Create Your Profile</h2>
          <p className="text-gray-700 mb-6">List yourself and connect with fellow alumni</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={imagePreview || undefined} />
                <AvatarFallback className="text-4xl">{formData.full_name.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={loading}
                />
                <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-black rounded-lg hover:bg-gray-200 transition">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium text-black">Upload Photo</span>
                </div>
              </label>
              <p className="text-xs text-gray-600">JPG, PNG up to 5MB</p>
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
                  onChange={(e) => setFormData({ ...formData, batch_year: parseInt(e.target.value) })}
                  disabled={loading}
                />
              </div>
            </div>

            {/* House & Contact */}
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
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label>Phone / WhatsApp</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                disabled={loading}
              />
            </div>

            {/* Security & Privacy Section */}
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <Label className="text-base font-semibold text-blue-900 m-0">Security & Privacy Settings</Label>
              </div>

              <div className="space-y-4">
                {/* Contact Visibility Toggle */}
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <Checkbox
                    id="show_contact"
                    checked={formData.show_contact_number}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, show_contact_number: checked as boolean })
                    }
                    disabled={loading}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="show_contact" className="text-sm cursor-pointer font-medium text-gray-700 m-0">
                      Let others see my phone number
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Other alumni will be able to see your phone number from above if you enable this
                    </p>
                  </div>
                </div>

                {/* Profile Password */}
                <div>
                  <Label className="text-sm font-medium">
                    Profile Password * <span className="text-xs text-blue-600">(Required for future updates)</span>
                  </Label>
                  <Input
                    type="password"
                    value={formData.profile_password}
                    onChange={(e) => setFormData({ ...formData, profile_password: e.target.value })}
                    placeholder="Create a secure password to update your profile later"
                    disabled={loading}
                    required
                    className="border-2"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    ⚠️ You'll need this password to edit or update your profile. Make it secure and remember it!
                  </p>
                </div>
              </div>
            </div>

            {/* Career/Education Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Profession / Status *</Label>
                <Input
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g., Software Engineer or Student"
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Company / Institution / College *</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g., Google or LDRP-ITR Gandhinagar"
                  disabled={loading}
                />
              </div>
            </div>

            {/* City */}
            <div>
              <Label>Current City *</Label>
              <Input
                value={formData.current_city}
                onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                placeholder="e.g., Bangalore"
                disabled={loading}
              />
            </div>

            {/* How can I help fellow Navodayans */}
            <div>
              <Label>How can I help fellow Navodayans:</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself, skills, or how you can help other alumni..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Social Links */}
            <div className="bg-white p-4 rounded-lg border-2 border-black">
              <Label className="text-base font-semibold text-black mb-4 block">Share Your Social Links</Label>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Instagram</Label>
                  <Input
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/yourprofile"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label className="text-sm">LinkedIn</Label>
                  <Input
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label className="text-sm">WhatsApp Number</Label>
                  <Input
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="91XXXXXXXXXX (with country code)"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="w-full bg-black text-white hover:bg-gray-800 border-2 border-gray-900" size="lg" disabled={loading}>
                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Adding Profile..." : "Add My Profile"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="border-2 border-black"
                size="lg"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>


    </div>
  );
}
