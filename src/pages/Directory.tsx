import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}

export default function Directory() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProfession, setFilterProfession] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [professions, setProfessions] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_approved", true);

      if (error) throw error;

      setProfiles(data || []);

      // Extract unique professions and cities for filters
      const uniqueProfessions = [...new Set((data || []).map((p) => p.profession))].sort();
      const uniqueCities = [...new Set((data || []).map((p) => p.current_city))].sort();

      setProfessions(uniqueProfessions);
      setCities(uniqueCities);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProfession =
      !filterProfession || profile.profession === filterProfession;
    const matchesCity = !filterCity || profile.current_city === filterCity;

    return matchesSearch && matchesProfession && matchesCity;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
          <p className="text-gray-600">Find and connect with fellow JNVDC alumni</p>
        </div>

        {/* Search & Filters */}
        <Card className="p-6 mb-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name, company, or bio..."
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
                  <SelectItem value="">All Professions</SelectItem>
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
                  <SelectItem value="">All Cities</SelectItem>
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
              onClick={() => {
                setSearchTerm("");
                setFilterProfession("");
                setFilterCity("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? "s" : ""}
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile.id}
              className="cursor-pointer hover:shadow-lg transition overflow-hidden"
              onClick={() => navigate(`/profile/${profile.id}`)}
            >
              <div className="p-6">
                {/* Avatar & Name */}
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.profile_image_url || undefined} />
                    <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {profile.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">Batch {profile.batch_year}</p>
                  </div>
                </div>

                {/* Career Info */}
                <div className="mb-4 space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {profile.profession}
                  </p>
                  <p className="text-sm text-gray-600">{profile.company_name}</p>
                  <p className="text-xs text-gray-500">{profile.current_city}</p>
                </div>

                {/* House Badge */}
                <div className="mb-4">
                  <Badge variant="secondary">{profile.house}</Badge>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{profile.bio}</p>
                )}

                {/* Help Offered */}
                {profile.help_offered && profile.help_offered.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Can Help With:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.help_offered.slice(0, 3).map((help) => (
                        <Badge
                          key={help}
                          variant="outline"
                          className="text-xs"
                        >
                          {help}
                        </Badge>
                      ))}
                      {profile.help_offered.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.help_offered.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Button
                  className="w-full"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${profile.id}`);
                  }}
                >
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-600">
              No profiles found matching your search criteria.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
