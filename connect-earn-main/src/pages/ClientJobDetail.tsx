import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useConversations } from "@/hooks/useConversations";
import { 
  ArrowLeft, 
  Briefcase, 
  Clock, 
  DollarSign, 
  MapPin,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  User
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  budget_min: number;
  budget_max: number;
  budget_type: string;
  category: string;
  skills: string[];
  duration: string;
  experience_level: string;
  is_remote: boolean;
  location: string;
}

interface Proposal {
  id: string;
  job_id: string;
  freelancer_id: string;
  cover_letter: string;
  bid_amount: number;
  timeline: string;
  status: string;
  created_at: string;
}

interface FreelancerProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

const ClientJobDetail = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startConversation } = useConversations(user?.id);
  
  const [job, setJob] = useState<Job | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [profiles, setProfiles] = useState<Record<string, FreelancerProfile>>({});
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);

  const handleMessageFreelancer = async (freelancerId: string) => {
    if (!id) return;
    const conversationId = await startConversation(freelancerId, id, true);
    if (conversationId) {
      navigate(`/messages?conversation=${conversationId}`);
    } else {
      toast({
        title: "ত্রুটি",
        description: "কথোপকথন শুরু করা যায়নি",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!user || !id) return;

      try {
        const { data: jobData, error: jobError } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .eq("client_id", user.id)
          .single();

        if (jobError) throw jobError;
        setJob(jobData);

        // Fetch proposals
        const { data: proposalsData, error: proposalsError } = await supabase
          .from("proposals")
          .select("*")
          .eq("job_id", id)
          .order("created_at", { ascending: false });

        if (proposalsError) throw proposalsError;
        setProposals(proposalsData || []);

        // Fetch freelancer profiles
        const freelancerIds = [...new Set((proposalsData || []).map(p => p.freelancer_id))];
        if (freelancerIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url")
            .in("id", freelancerIds);

          const profilesMap: Record<string, FreelancerProfile> = {};
          (profilesData || []).forEach(p => {
            profilesMap[p.id] = p;
          });
          setProfiles(profilesMap);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        navigate("/my-jobs");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJobData();
    }
  }, [user, id, navigate]);

  const handleAcceptProposal = async (proposal: Proposal) => {
    try {
      // Use atomic function for all-or-nothing operation
      const { data: contractId, error } = await supabase
        .rpc('accept_proposal_atomic', {
          _proposal_id: proposal.id,
          _job_id: job?.id
        });

      if (error) throw error;

      toast({ 
        title: "প্রস্তাব গ্রহণ করা হয়েছে!", 
        description: "ফ্রিল্যান্সারের সাথে চুক্তি তৈরি হয়েছে।"
      });

      // Refresh data - update all proposals atomically
      setProposals(proposals.map(p => ({
        ...p,
        status: p.id === proposal.id ? "accepted" : (p.status === "pending" ? "rejected" : p.status)
      })));
      setJob(job ? { ...job, status: "in-progress" } : null);
    } catch (error: any) {
      toast({ 
        title: "প্রস্তাব গ্রহণ ব্যর্থ হয়েছে", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setSelectedProposal(null);
      setActionType(null);
    }
  };

  const handleRejectProposal = async (proposal: Proposal) => {
    try {
      await supabase
        .from("proposals")
        .update({ status: "rejected" })
        .eq("id", proposal.id);

      toast({ title: "Proposal rejected" });
      setProposals(proposals.map(p => 
        p.id === proposal.id ? { ...p, status: "rejected" } : p
      ));
    } catch (error: any) {
      toast({ 
        title: "Failed to reject proposal", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setSelectedProposal(null);
      setActionType(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Button onClick={() => navigate("/my-jobs")}>Back to My Jobs</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const pendingProposals = proposals.filter(p => p.status === "pending");
  const acceptedProposal = proposals.find(p => p.status === "accepted");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/my-jobs")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Jobs
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">{job.category}</Badge>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      job.status === "open" ? "bg-success/10 text-success" :
                      job.status === "in-progress" ? "bg-info/10 text-info" :
                      "bg-muted"
                    }
                  >
                    {job.status.replace("-", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${job.budget_min} - ${job.budget_max} / {job.budget_type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.duration || "Not specified"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.is_remote ? "Remote" : job.location || "On-site"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.experience_level || "Any level"}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  Posted on {new Date(job.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            {/* Proposals Section */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Proposals ({proposals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {proposals.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No proposals yet</p>
                    <p className="text-sm text-muted-foreground">
                      Freelancers will submit their proposals here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((proposal) => {
                      const profile = profiles[proposal.freelancer_id];
                      const isAccepted = proposal.status === "accepted";
                      const isRejected = proposal.status === "rejected";
                      
                      return (
                        <div 
                          key={proposal.id}
                          className={`p-4 rounded-xl border ${
                            isAccepted ? "border-success/50 bg-success/5" :
                            isRejected ? "border-muted bg-muted/30 opacity-60" :
                            "border-border bg-secondary/30"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {profile?.first_name?.[0] || <User className="w-4 h-4" />}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">
                                  {profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Freelancer" : "Freelancer"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(proposal.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary">${proposal.bid_amount}</p>
                              {proposal.timeline && (
                                <p className="text-sm text-muted-foreground">{proposal.timeline}</p>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
                            {proposal.cover_letter}
                          </p>

                          {proposal.status === "pending" && job.status === "open" ? (
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedProposal(proposal);
                                  setActionType("accept");
                                }}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedProposal(proposal);
                                  setActionType("reject");
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleMessageFreelancer(proposal.freelancer_id)}
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                বার্তা
                              </Button>
                            </div>
                          ) : (
                            <Badge 
                              variant="outline"
                              className={
                                isAccepted ? "bg-success/10 text-success" :
                                isRejected ? "bg-muted" :
                                ""
                              }
                            >
                              {proposal.status}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Proposals</span>
                  <span className="font-semibold">{proposals.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-warning">{pendingProposals.length}</span>
                </div>
                {acceptedProposal && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hired</span>
                    <span className="font-semibold text-success">1</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {acceptedProposal && (
              <Card className="glass border-success/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    Hired Freelancer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {profiles[acceptedProposal.freelancer_id]?.first_name?.[0] || <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {profiles[acceptedProposal.freelancer_id] 
                          ? `${profiles[acceptedProposal.freelancer_id].first_name || ""} ${profiles[acceptedProposal.freelancer_id].last_name || ""}`.trim() 
                          : "Freelancer"}
                      </p>
                      <p className="text-sm text-primary">${acceptedProposal.bid_amount}</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => navigate("/contracts")}>
                    View Contract
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedProposal && !!actionType} onOpenChange={() => {
        setSelectedProposal(null);
        setActionType(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "accept" ? "Accept Proposal?" : "Reject Proposal?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "accept" 
                ? "This will create a contract with this freelancer and reject all other proposals."
                : "This freelancer will be notified that their proposal was not selected."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedProposal && actionType === "accept") {
                  handleAcceptProposal(selectedProposal);
                } else if (selectedProposal && actionType === "reject") {
                  handleRejectProposal(selectedProposal);
                }
              }}
              className={actionType === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {actionType === "accept" ? "Accept & Create Contract" : "Reject Proposal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientJobDetail;
