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
import { Loader, Instagram, Linkedin, MessageCircle, Send } from "lucide-react";

interface Alumni {
  id: string;
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
  instagram_url: string | null;
  linkedin_url: string | null;
  whatsapp_number: string | null;
  created_at: string;
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
  const [cities, setCities] = useState<string[]>([]);
  const [professions, setProfessions] = useState<string[]>([]);

  // Fetch alumni on component mount
  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("alumni").select("*").order("created_at", { ascending: false });

      if (error) throw error;

      setAlumni(data || []);

      // Extract unique cities and professions
      const uniqueCities = [...new Set((data || []).map((a) => a.current_city))].sort();
      const uniqueProfessions = [...new Set((data || []).map((a) => a.profession))].sort();

      setCities(uniqueCities);
      setProfessions(uniqueProfessions);
    } catch (err) {
      console.error("Error fetching alumni:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((item) => {
    const matchesSearch =
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = !filterCity || item.current_city === filterCity;
    const matchesProfession = !filterProfession || item.profession === filterProfession;

    return matchesSearch && matchesCity && matchesProfession;
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
                  <Avatar className="h-32 w-32 border-4 border-white -mt-16 mb-4">
                    <AvatarImage src={selectedAlumni.profile_image_url || undefined} />
                    <AvatarFallback className="text-2xl">{selectedAlumni.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedAlumni.full_name}</h1>

                  <div className="space-y-2 mb-4">
                    <p className="text-lg font-semibold text-black">{selectedAlumni.profession}</p>
                    <p className="text-gray-700">{selectedAlumni.company_name}</p>
                    <p className="text-sm text-gray-600">📍 {selectedAlumni.current_city}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge>{selectedAlumni.house}</Badge>
                    <Badge variant="outline">Batch {selectedAlumni.batch_year}</Badge>
                  </div>

                  <div className="space-y-2">
                    {selectedAlumni.email && (
                      <p className="text-sm">
                        <a href={`mailto:${selectedAlumni.email}`} className="text-black font-semibold hover:underline">
                          ✉️ {selectedAlumni.email}
                        </a>
                      </p>
                    )}
                    {selectedAlumni.phone && (
                      <p className="text-sm">
                        <a href={`tel:${selectedAlumni.phone}`} className="text-black font-semibold hover:underline">
                          📱 {selectedAlumni.phone}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 mb-6">
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
                    {selectedAlumni.whatsapp_number && (
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

              {selectedAlumni.bio && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Bio</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedAlumni.bio}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                        {item.whatsapp_number && (
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
