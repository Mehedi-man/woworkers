import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, User, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  amount: number;
  created_at: string;
  client_id: string;
}

interface ClientProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface FreelancerReviewsProps {
  freelancerId: string;
}

export const FreelancerReviews = ({ freelancerId }: FreelancerReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [clients, setClients] = useState<Record<string, ClientProfile>>({});
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: reviewsData, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("freelancer_id", freelancerId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(reviewsData || []);

        // Calculate average rating
        if (reviewsData && reviewsData.length > 0) {
          const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }

        // Fetch client profiles
        const clientIds = [...new Set((reviewsData || []).map(r => r.client_id))];
        if (clientIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url")
            .in("id", clientIds);

          const clientsMap: Record<string, ClientProfile> = {};
          (profilesData || []).forEach(p => { clientsMap[p.id] = p; });
          setClients(clientsMap);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (freelancerId) {
      fetchReviews();
    }
  }, [freelancerId]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            রিভিউ সমূহ ({reviews.length})
          </CardTitle>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-5 h-5",
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold">{averageRating}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>এখনো কোনো রিভিউ নেই</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const client = clients[review.client_id];
              return (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {client?.first_name?.[0] || <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {client ? `${client.first_name || ""} ${client.last_name || ""}`.trim() || "ক্লায়েন্ট" : "ক্লায়েন্ট"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-sm text-muted-foreground mt-1">
                        ৳{review.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{review.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
