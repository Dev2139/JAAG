import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader, Instagram, Linkedin, MessageCircle, Send, Edit, Lock, Facebook } from "lucide-react";

interface Alumni {
  id: string;
  user_id: string;
  full_name: string;
  batch_year: number;
  house: string;
  profession: string;
  company_name: string;
  current_city: string;
  bio: string;
  profile_image_url: string | null;
  email: string;
  phone: string;
  facebook_url?: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  whatsapp_number: string | null;
  created_at: string;
  profile_password?: string;
  show_contact_number: boolean;
  show_whatsapp?: boolean;
}

// House color mapping
const HOUSE_COLORS = {
  Aravali: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "bg-blue-100",
    badge: "bg-blue-600 text-white",
  },
  Nilgiri: {
    bg: "bg-green-50",
    border: "border-green-200",
    accent: "bg-green-100",
    badge: "bg-green-600 text-white",
  },
  Shivalik: {
    bg: "bg-red-50",
    border: "border-red-200",
    accent: "bg-red-100",
    badge: "bg-red-600 text-white",
  },
  Udaygiri: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    accent: "bg-yellow-100",
    badge: "bg-yellow-600 text-white",
  },
};

const getHouseColors = (house: string) => HOUSE_COLORS[house as keyof typeof HOUSE_COLORS] || HOUSE_COLORS.Aravali;

export default function Home() {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterProfession, setFilterProfession] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [professions, setProfessions] = useState<string[]>([]);
  const [batchYears, setBatchYears] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Alumni | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fetch alumni on component mount
  useEffect(() => {
    fetchAlumni();
    getCurrentUser();
  }, []);

  // Get current user
  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  // Start editing profile
  const handleStartEdit = () => {
    if (selectedAlumni) {
      setEditFormData(selectedAlumni);
      setShowPasswordModal(true);
      setPasswordInput("");
      setPasswordError("");
    }
  };

  // Verify password and enable editing
  const handleVerifyPassword = () => {
    if (!selectedAlumni || !editFormData) return;
    
    if (passwordInput === selectedAlumni.profile_password) {
      setShowPasswordModal(false);
      setIsEditing(true);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password");
      setPasswordInput("");
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!selectedAlumni || !editFormData) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          profession: editFormData.profession,
          company_name: editFormData.company_name,
          current_city: editFormData.current_city,
          bio: editFormData.bio,
          show_contact_number: editFormData.show_contact_number,
          show_whatsapp: editFormData.show_whatsapp,
          phone: editFormData.phone,
          facebook_url: editFormData.facebook_url,
          whatsapp_number: editFormData.whatsapp_number,
          instagram_url: editFormData.instagram_url,
          linkedin_url: editFormData.linkedin_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedAlumni.id);

      if (error) throw error;

      // Update local state
      const updatedAlumni = {
        ...selectedAlumni,
        ...editFormData,
      };
      setSelectedAlumni(updatedAlumni);
      setAlumni(alumni.map(a => a.id === selectedAlumni.id ? updatedAlumni : a));
      
      setIsEditing(false);
      setEditFormData(null);
      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
    setShowPasswordModal(false);
    setPasswordInput("");
    setPasswordError("");
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    if (!selectedAlumni) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this profile? This action cannot be undone.\n\nProfile: ${selectedAlumni.full_name}`
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", selectedAlumni.id);

      if (error) throw error;

      // Remove from local state
      setAlumni(alumni.filter(a => a.id !== selectedAlumni.id));
      setSelectedAlumni(null);
      toast({ title: "Success", description: "Profile deleted successfully" });
    } catch (err) {
      console.error("Error deleting profile:", err);
      toast({ title: "Error", description: "Failed to delete profile", variant: "destructive" });
    }
  };

  // Scroll to top when profile detail is opened
  useEffect(() => {
    if (selectedAlumni) {
      window.scrollTo(0, 0);
    }
  }, [selectedAlumni]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*").order("batch_year", { ascending: true });

      if (error) throw error;

      setAlumni(data || []);

      // Extract unique cities, professions, and batch years
      const uniqueCities = [...new Set((data || []).map((a) => a.current_city))].sort();
      const uniqueProfessions = [...new Set((data || []).map((a) => a.profession))].sort();
      const uniqueBatchYears = [...new Set((data || []).map((a) => a.batch_year))].sort((a, b) => b - a); // Sort descending

      setCities(uniqueCities);
      setProfessions(uniqueProfessions);
      setBatchYears(uniqueBatchYears);
    } catch (err) {
      console.error("Error fetching alumni:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((item) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      !lowerSearch ||
      item.full_name.toLowerCase().includes(lowerSearch) ||
      item.company_name.toLowerCase().includes(lowerSearch) ||
      item.house.toLowerCase().includes(lowerSearch) ||
      item.batch_year.toString().includes(lowerSearch) ||
      item.profession.toLowerCase().includes(lowerSearch) ||
      (item.bio && item.bio.toLowerCase().includes(lowerSearch));

    const matchesCity = !filterCity || item.current_city === filterCity;
    const matchesProfession = !filterProfession || item.profession === filterProfession;
    const matchesBatch = !selectedBatch || item.batch_year === selectedBatch;

    return matchesSearch && matchesCity && matchesProfession && matchesBatch;
  });

  // Profile detail view
  if (selectedAlumni) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="outline" onClick={() => setSelectedAlumni(null)} className="mb-4 border-2 border-black">
            ← Back to Directory
          </Button>

          <Card className="overflow-hidden border-4 border-black">
            <div className="h-32 bg-gradient-to-r from-black to-gray-800" />

            <div className="px-6 py-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center md:items-start">
                  <img
                    src={selectedAlumni.profile_image_url || `https://via.placeholder.com/200/cccccc/666666?text=${selectedAlumni.full_name.charAt(0)}`}
                    alt={selectedAlumni.full_name}
                    className="h-48 w-48 object-cover border-4 border-white -mt-16 mb-4 shadow-lg"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedAlumni.full_name}</h1>

                  <div className="space-y-2 mb-4">
                    {isEditing && editFormData ? (
                      <>
                        <div>
                          <Label className="text-sm">Profession</Label>
                          <Input
                            value={editFormData.profession}
                            onChange={(e) => setEditFormData({ ...editFormData, profession: e.target.value })}
                            placeholder="e.g., Software Engineer"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Company</Label>
                          <Input
                            value={editFormData.company_name}
                            onChange={(e) => setEditFormData({ ...editFormData, company_name: e.target.value })}
                            placeholder="Company name"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">City</Label>
                          <Input
                            value={editFormData.current_city}
                            onChange={(e) => setEditFormData({ ...editFormData, current_city: e.target.value })}
                            placeholder="Current city"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold text-black">{selectedAlumni.profession}</p>
                        <p className="text-gray-700">{selectedAlumni.company_name}</p>
                        <p className="text-sm text-gray-600">📍 {selectedAlumni.current_city}</p>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge>{selectedAlumni.house}</Badge>
                    <Badge variant="outline">Batch {selectedAlumni.batch_year}</Badge>
                  </div>

                  {isEditing && editFormData ? (
                    <div className="bg-blue-50 p-4 rounded-lg space-y-3 mb-4">
                      <div>
                        <Label className="text-sm">Phone / WhatsApp</Label>
                        <Input
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Facebook URL</Label>
                        <Input
                          value={editFormData.facebook_url || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, facebook_url: e.target.value })}
                          placeholder="https://facebook.com/yourprofile"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">WhatsApp Number</Label>
                        <Input
                          value={editFormData.whatsapp_number}
                          onChange={(e) => setEditFormData({ ...editFormData, whatsapp_number: e.target.value })}
                          placeholder="For WhatsApp link"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Instagram URL</Label>
                        <Input
                          value={editFormData.instagram_url}
                          onChange={(e) => setEditFormData({ ...editFormData, instagram_url: e.target.value })}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div>
                        <Label className="text-sm">LinkedIn URL</Label>
                        <Input
                          value={editFormData.linkedin_url}
                          onChange={(e) => setEditFormData({ ...editFormData, linkedin_url: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="show_phone"
                          checked={editFormData.show_contact_number}
                          onChange={(e) => setEditFormData({ ...editFormData, show_contact_number: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="show_phone" className="text-sm cursor-pointer">Let others see my phone number</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="show_whatsapp"
                          checked={editFormData.show_whatsapp}
                          onChange={(e) => setEditFormData({ ...editFormData, show_whatsapp: e.target.checked })}
                          disabled={!editFormData.show_contact_number}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="show_whatsapp" className="text-sm cursor-pointer">Let others see my WhatsApp details</Label>
                        {!editFormData.show_contact_number && (
                          <p className="text-xs text-gray-500 ml-2">(Enable phone visibility first)</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {selectedAlumni.email && (
                        <p className="text-sm">
                          <a href={`mailto:${selectedAlumni.email}`} className="text-black font-semibold hover:underline">
                            ✉️ {selectedAlumni.email}
                          </a>
                        </p>
                      )}
                      {selectedAlumni.show_contact_number && selectedAlumni.phone && (
                        <p className="text-sm">
                          <a href={`tel:${selectedAlumni.phone}`} className="text-black font-semibold hover:underline">
                            📱 {selectedAlumni.phone}
                          </a>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-3 mb-6">
                    {selectedAlumni.facebook_url && (
                      <a
                        href={selectedAlumni.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {selectedAlumni.instagram_url && (
                      <a
                        href={selectedAlumni.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {selectedAlumni.linkedin_url && (
                      <a
                        href={selectedAlumni.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {selectedAlumni.show_contact_number && selectedAlumni.show_whatsapp && selectedAlumni.whatsapp_number && (
                      <a
                        href={`https://wa.me/${selectedAlumni.whatsapp_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </a>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      if (selectedAlumni.email) {
                        window.location.href = `mailto:${selectedAlumni.email}`;
                      } else {
                        toast({ title: "No email available", variant: "destructive" });
                      }
                    }}
                    className="gap-2 bg-black text-white hover:bg-gray-800 border-2 border-gray-900"
                    size="lg"
                  >
                    <Send className="h-4 w-4" />
                    Connect via Email
                  </Button>

                  {/* Edit Profile Button - Password protected, always visible */}
                  {!isEditing && (
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={handleStartEdit}
                        className="gap-2 flex-1 bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-700"
                        size="lg"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  )}

                  {/* Save/Cancel Buttons when editing - Only show when in edit mode */}
                  {isEditing && (
                    <div className="space-y-3 mt-4">
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveProfile}
                          className="gap-2 flex-1 bg-green-600 text-white hover:bg-green-700 border-2 border-green-700"
                          size="lg"
                        >
                          ✓ Save Changes
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="gap-2 flex-1 border-2 border-gray-900"
                          size="lg"
                        >
                          Cancel
                        </Button>
                      </div>
                      <Button
                        onClick={handleDeleteProfile}
                        className="w-full gap-2 bg-red-600 text-white hover:bg-red-700 border-2 border-red-700"
                        size="lg"
                      >
                        🗑️ Delete Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <hr className="my-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">House</p>
                      <p className="text-gray-900">{selectedAlumni.house}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Batch Year</p>
                      <p className="text-gray-900">{selectedAlumni.batch_year}</p>
                    </div>
                  </div>
                </div>


              </div>

              {(selectedAlumni.bio || isEditing) && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">How can I help fellow Navodayans:</h2>
                  {isEditing && editFormData ? (
                    <Textarea
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="min-h-32"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedAlumni.bio}</p>
                  )}
                </div>
              )}

              {/* Password Verification Modal */}
              {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-md p-6 mx-4">
                    <h2 className="text-xl font-bold mb-4">Verify Password</h2>
                    <p className="text-sm text-gray-600 mb-4">Enter your profile password to edit your profile</p>
                    <Input
                      type="password"
                      placeholder="Enter your profile password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError("");
                      }}
                      onKeyPress={(e) => e.key === "Enter" && handleVerifyPassword()}
                      className="mb-2"
                    />
                    {passwordError && <p className="text-red-600 text-sm mb-4">{passwordError}</p>}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleVerifyPassword}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Verify
                      </Button>
                      <Button
                        onClick={() => {
                          setShowPasswordModal(false);
                          setPasswordInput("");
                          setPasswordError("");
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black shadow-lg border-b-4 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
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
          <p className="text-gray-300 mt-2">Connect with fellow alumni and students - list yourself, explore others' profiles, and reach out via WhatsApp, LinkedIn, or Instagram</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Profile Button */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/add-profile")}
            size="lg"
            className="bg-black text-white hover:bg-gray-800 border-2 border-gray-900"
          >
            + List Yourself
          </Button>
        </div>

        {/* Search & Filters */}
        <Card className="p-6 mb-8 bg-gray-100 border-2 border-black">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Search by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={selectedBatch?.toString() || ""} onValueChange={(v) => setSelectedBatch(v ? parseInt(v) : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by batch year" />
                </SelectTrigger>
                <SelectContent>
                  {batchYears.map((batch) => {
                    const batchCount = alumni.filter((a) => a.batch_year === batch).length;
                    return (
                      <SelectItem key={batch} value={batch.toString()}>
                        {batch} ({batchCount} alumni)
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterProfession} onValueChange={setFilterProfession}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by profession" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="border-2 border-black bg-white text-black hover:bg-gray-200"
              onClick={() => {
                setSearchTerm("");
                setFilterProfession("");
                setFilterCity("");
                setSelectedBatch(null);
              }}
            >
              Reset
            </Button>
          </div>
          <p className="text-sm text-black font-semibold mt-4">Found {filteredAlumni.length} alumni</p>
        </Card>

        {/* Alumni Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-black" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlumni.map((item) => {
              const colors = getHouseColors(item.house);
              return (
                <Card
                  key={item.id}
                  className={`cursor-pointer hover:shadow-2xl transition overflow-hidden flex flex-col border-2 ${colors.border} ${colors.bg}`}
                  onClick={() => setSelectedAlumni(item)}
                >
                  {/* Image on top - full width */}
                  <div className="w-full h-48 md:h-60 lg:h-72 bg-gradient-to-br from-gray-800 to-black overflow-hidden flex items-center justify-center relative">
                    {item.profile_image_url ? (
                      <img
                        src={item.profile_image_url}
                        alt={item.full_name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-black">
                        <Avatar className="h-40 w-40 border-4 border-white">
                          <AvatarFallback className="text-6xl bg-gray-600 text-white">{item.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    {/* Year badge */}
                    <div className={`absolute top-3 right-3 ${colors.badge} px-3 py-1 rounded-full font-bold text-sm`}>
                      {item.batch_year}
                    </div>
                  </div>

                  {/* Name on mobile only */}
                  <div className="md:hidden p-3 text-center border-t-2" style={{ borderColor: colors.border }}>
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{item.full_name}</h3>
                  </div>

                  {/* Full details section - hidden on mobile, visible on md+ */}
                  <div className="hidden md:flex p-4 md:p-6 flex-1 flex-col">
                    {/* Name & House */}
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{item.full_name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`${colors.badge} px-3 py-1 rounded-full font-semibold text-xs`}>
                          {item.house}
                        </span>
                      </div>
                    </div>

                    {/* Profession & Company */}
                    <div className="mb-3">
                      <p className="text-sm font-bold text-gray-900">{item.profession}</p>
                      <p className="text-xs text-gray-700">{item.company_name}</p>
                      <p className="text-xs text-gray-600 mt-1">📍 {item.current_city}</p>
                    </div>

                    {/* Bio/How I can help */}
                    {item.bio && (
                      <div className={`mb-3 p-3 ${colors.accent} rounded-lg text-xs text-gray-800 line-clamp-3 border ${colors.border}`}>
                        <p className="font-semibold mb-1">💡 How I can help:</p>
                        {item.bio}
                      </div>
                    )}

                    {/* Social Links - Bottom */}
                    <div className="mt-auto pt-4 border-t-2" style={{ borderColor: colors.border }}>
                      <div className="flex gap-3 justify-center mb-3">
                      {item.show_contact_number && item.show_whatsapp && item.whatsapp_number && (
                          <a
                            href={`https://wa.me/${item.whatsapp_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition flex items-center justify-center"
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-5 w-5" />
                          </a>
                        )}
                        {item.linkedin_url && (
                          <a
                            href={item.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition flex items-center justify-center"
                            title="LinkedIn"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {item.instagram_url && (
                          <a
                            href={item.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition flex items-center justify-center"
                            title="Instagram"
                          >
                            <Instagram className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                      <Button
                        className={`w-full ${colors.badge}`}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlumni(item);
                        }}
                      >
                        View Full Profile
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filteredAlumni.length === 0 && (
          <Card className="p-12 text-center bg-white">
            <p className="text-gray-600 text-lg">No alumni found. Be the first to list yourself!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
