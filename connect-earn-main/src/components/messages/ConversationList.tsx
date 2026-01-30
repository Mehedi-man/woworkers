import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  job_id: string | null;
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

interface ConversationListProps {
  conversations: Conversation[];
  profiles: Record<string, Profile>;
  jobs: Record<string, Job>;
  unreadCounts: Record<string, number>;
  selectedId: string | null;
  currentUserId: string;
  loading: boolean;
  onSelect: (conversation: Conversation) => void;
}

export const ConversationList = ({
  conversations,
  profiles,
  jobs,
  unreadCounts,
  selectedId,
  currentUserId,
  loading,
  onSelect,
}: ConversationListProps) => {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <User className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">কোনো কথোপকথন নেই</p>
        <p className="text-sm text-muted-foreground mt-1">
          কাজের বিবরণ থেকে ফ্রিল্যান্সারের সাথে যোগাযোগ শুরু করুন
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        const otherUserId = currentUserId === conversation.client_id 
          ? conversation.freelancer_id 
          : conversation.client_id;
        const profile = profiles[otherUserId];
        const job = conversation.job_id ? jobs[conversation.job_id] : null;
        const unreadCount = unreadCounts[conversation.id] || 0;
        const isSelected = selectedId === conversation.id;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={cn(
              "w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50",
              isSelected && "bg-muted"
            )}
          >
            <Avatar className="w-12 h-12">
              <AvatarFallback>
                {profile?.first_name?.[0] || <User className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">
                  {profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "ব্যবহারকারী" : "ব্যবহারকারী"}
                </p>
                {unreadCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              {job && (
                <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {job.title}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(conversation.last_message_at).toLocaleDateString("bn-BD")}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
