import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  job_id: string | null;
  contract_id: string | null;
  last_message_at: string;
  created_at: string;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface Job {
  id: string;
  title: string;
}

export const useConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        // Fetch conversations
        const { data: convData, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
          .order("last_message_at", { ascending: false });

        if (convError) throw convError;
        setConversations(convData || []);

        if (!convData || convData.length === 0) {
          setLoading(false);
          return;
        }

        // Get all user IDs to fetch profiles
        const userIds = new Set<string>();
        convData.forEach((c) => {
          userIds.add(c.client_id);
          userIds.add(c.freelancer_id);
        });

        // Fetch profiles
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, avatar_url")
          .in("id", Array.from(userIds));

        const profilesMap: Record<string, Profile> = {};
        (profilesData || []).forEach((p) => {
          profilesMap[p.id] = p;
        });
        setProfiles(profilesMap);

        // Fetch jobs
        const jobIds = convData.filter((c) => c.job_id).map((c) => c.job_id!);
        if (jobIds.length > 0) {
          const { data: jobsData } = await supabase
            .from("jobs")
            .select("id, title")
            .in("id", jobIds);

          const jobsMap: Record<string, Job> = {};
          (jobsData || []).forEach((j) => {
            jobsMap[j.id] = j;
          });
          setJobs(jobsMap);
        }

        // Fetch unread counts
        const conversationIds = convData.map((c) => c.id);
        const { data: unreadData } = await supabase
          .from("messages")
          .select("conversation_id")
          .in("conversation_id", conversationIds)
          .neq("sender_id", userId)
          .eq("is_read", false);

        const counts: Record<string, number> = {};
        (unreadData || []).forEach((m) => {
          counts[m.conversation_id] = (counts[m.conversation_id] || 0) + 1;
        });
        setUnreadCounts(counts);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to new messages for unread count updates
    const channel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          // Refresh conversations on new message
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const startConversation = async (
    otherUserId: string,
    jobId?: string,
    isClient: boolean = true
  ): Promise<string | null> => {
    if (!userId) return null;

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("client_id", isClient ? userId : otherUserId)
        .eq("freelancer_id", isClient ? otherUserId : userId)
        .eq("job_id", jobId || null)
        .single();

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({
          client_id: isClient ? userId : otherUserId,
          freelancer_id: isClient ? otherUserId : userId,
          job_id: jobId || null,
        })
        .select("id")
        .single();

      if (error) throw error;
      return newConv?.id || null;
    } catch (error) {
      console.error("Error starting conversation:", error);
      return null;
    }
  };

  return {
    conversations,
    profiles,
    jobs,
    unreadCounts,
    loading,
    startConversation,
  };
};
