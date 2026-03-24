import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface Profile {
  id: string;
  full_name: string;
  batch_year: number;
  house: "Aravali" | "Nilgiri" | "Shivalik" | "Udaygiri";
  migration_jnv?: string;
  profession: string;
  company_name: string;
  current_city: string;
  help_offered: string[];
  bio?: string;
  profile_image_url?: string;
  is_approved: boolean;
  is_admin: boolean;
  email?: string;
  whatsapp?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setProfile(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch profile");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
};

export const useProfiles = (filters?: {
  batch_year?: number;
  house?: string;
  profession?: string;
  city?: string;
  search?: string;
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from("profiles")
          .select("*")
          .eq("is_approved", true);

        if (filters?.batch_year) {
          query = query.eq("batch_year", filters.batch_year);
        }
        if (filters?.house) {
          query = query.eq("house", filters.house);
        }
        if (filters?.profession) {
          query = query.ilike("profession", `%${filters.profession}%`);
        }
        if (filters?.city) {
          query = query.ilike("current_city", `%${filters.city}%`);
        }
        if (filters?.search) {
          query = query.or(
            `full_name.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`
          );
        }

        const { data, error } = await query;

        if (error) throw error;
        setProfiles(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch profiles");
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [filters]);

  return { profiles, loading, error };
};

export const useSuggestions = (userId: string) => {
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc("get_suggestions", {
          user_id: userId,
          limit_count: 10,
        });

        if (error) throw error;
        setSuggestions(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch suggestions");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userId]);

  return { suggestions, loading, error };
};
