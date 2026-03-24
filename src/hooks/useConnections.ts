import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface Connection {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
}

export const useConnections = (userId: string) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("connections")
          .select("*")
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

        if (error) throw error;
        setConnections(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch connections");
        setConnections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [userId]);

  const sendRequest = async (targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from("connections")
        .insert([
          {
            sender_id: userId,
            receiver_id: targetUserId,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setConnections([...connections, data]);
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send request";
      return { success: false, error: message };
    }
  };

  const updateConnection = async (
    connectionId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      const { data, error } = await supabase
        .from("connections")
        .update({ status })
        .eq("id", connectionId)
        .select()
        .single();

      if (error) throw error;
      setConnections(connections.map((c) => (c.id === connectionId ? data : c)));
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update connection";
      return { success: false, error: message };
    }
  };

  const getConnectionStatus = (targetUserId: string) => {
    const conn = connections.find(
      (c) =>
        (c.sender_id === userId && c.receiver_id === targetUserId) ||
        (c.receiver_id === userId && c.sender_id === targetUserId)
    );
    return conn?.status || null;
  };

  const isConnected = (targetUserId: string) => {
    return connections.some(
      (c) =>
        ((c.sender_id === userId && c.receiver_id === targetUserId) ||
          (c.receiver_id === userId && c.sender_id === targetUserId)) &&
        c.status === "accepted"
    );
  };

  return {
    connections,
    loading,
    error,
    sendRequest,
    updateConnection,
    getConnectionStatus,
    isConnected,
  };
};

export const useBookmarks = (userId: string) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("bookmarks")
          .select("saved_profile_id")
          .eq("user_id", userId);

        if (error) throw error;
        setBookmarks(data?.map((b) => b.saved_profile_id) || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch bookmarks");
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userId]);

  const toggleBookmark = async (profileId: string) => {
    try {
      if (bookmarks.includes(profileId)) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userId)
          .eq("saved_profile_id", profileId);

        if (error) throw error;
        setBookmarks(bookmarks.filter((b) => b !== profileId));
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert([
            {
              user_id: userId,
              saved_profile_id: profileId,
            },
          ]);

        if (error) throw error;
        setBookmarks([...bookmarks, profileId]);
      }
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to toggle bookmark";
      return { success: false, error: message };
    }
  };

  const isBookmarked = (profileId: string) => bookmarks.includes(profileId);

  return { bookmarks, loading, error, toggleBookmark, isBookmarked };
};
