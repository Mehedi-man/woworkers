import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { DeliveryView } from "@/components/contracts/DeliveryView";
import { 
  FileCheck, 
  Clock, 
  DollarSign, 
  User,
  CheckCircle,
  PauseCircle,
  AlertCircle,
  MessageSquare,
  MoreVertical,
  Package
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface Contract {
  id: string;
  job_id: string;
  freelancer_id: string;
  contract_type: string;
  amount: number;
  status: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  delivery_text: string | null;
  delivered_at: string | null;
  delivery_status: string | null;
}

interface Job {
  id: string;
  title: string;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

const ClientContracts = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [actionType, setActionType] = useState<"cancel" | "revision" | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user) return;

      try {
        const { data: contractsData, error } = await supabase
          .from("contracts")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setContracts(contractsData || []);

        // Fetch related jobs
        const jobIds = [...new Set((contractsData || []).map(c => c.job_id))];
        if (jobIds.length > 0) {
          const { data: jobsData } = await supabase
            .from("jobs")
            .select("id, title")
            .in("id", jobIds);
          
          const jobsMap: Record<string, Job> = {};
          (jobsData || []).forEach(j => { jobsMap[j.id] = j; });
          setJobs(jobsMap);
        }

        // Fetch freelancer profiles
        const freelancerIds = [...new Set((contractsData || []).map(c => c.freelancer_id))];
        if (freelancerIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url")
            .in("id", freelancerIds);
          
          const profilesMap: Record<string, Profile> = {};
          (profilesData || []).forEach(p => { profilesMap[p.id] = p; });
          setProfiles(profilesMap);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchContracts();
    }
  }, [user]);

  const handleAcceptDelivery = async (contract: Contract) => {
    setSelectedContract(contract);
    setShowReviewDialog(true);
  };

  const handleRequestRevision = async (contract: Contract) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("contracts")
        .update({ delivery_status: "revision_requested" })
        .eq("id", contract.id);

      if (error) throw error;

      toast({ 
        title: "সংশোধনের অনুরোধ পাঠানো হয়েছে", 
        description: "ফ্রিল্যান্সার পুনরায় ডেলিভারি দেবেন" 
      });

      setContracts(contracts.map(c =>
        c.id === contract.id
          ? { ...c, delivery_status: "revision_requested" }
          : c
      ));
    } catch (error: any) {
      toast({
        title: "ত্রুটি হয়েছে",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteWithReview = async (rating: number, comment: string) => {
    if (!selectedContract || !user) return;
    
    setIsSubmittingReview(true);
    try {
      // Use atomic function for all-or-nothing operation
      const { error } = await supabase
        .rpc('complete_contract_atomic', {
          _contract_id: selectedContract.id,
          _rating: rating,
          _comment: comment
        });

      if (error) throw error;

      toast({ title: "চুক্তি সম্পন্ন হয়েছে", description: "আপনার রিভিউ জমা দেওয়া হয়েছে" });
      
      setContracts(contracts.map(c => 
        c.id === selectedContract.id 
          ? { ...c, status: "completed", end_date: new Date().toISOString(), delivery_status: "accepted" } 
          : c
      ));
      
      setShowReviewDialog(false);
      setSelectedContract(null);
    } catch (error: any) {
      toast({ 
        title: "ত্রুটি হয়েছে", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleCancelContract = async (contract: Contract) => {
    try {
      const { error } = await supabase
        .from("contracts")
        .update({ status: "cancelled" })
        .eq("id", contract.id);

      if (error) throw error;

      toast({ title: "চুক্তি বাতিল করা হয়েছে" });
      setContracts(contracts.map(c => 
        c.id === contract.id ? { ...c, status: "cancelled" } : c
      ));
    } catch (error: any) {
      toast({ title: "ত্রুটি হয়েছে", description: error.message, variant: "destructive" });
    } finally {
      setSelectedContract(null);
      setActionType(null);
    }
  };

  const filteredContracts = contracts.filter(c => {
    if (activeTab === "active") return c.status === "active";
    if (activeTab === "completed") return c.status === "completed";
    if (activeTab === "all") return true;
    return false;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-success" />;
      case "paused": return <PauseCircle className="w-4 h-4 text-warning" />;
      case "completed": return <FileCheck className="w-4 h-4 text-info" />;
      case "disputed": return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const getStatusBadge = (contract: Contract) => {
    if (contract.status === "completed") {
      return (
        <Badge variant="outline" className="bg-info/10 text-info border-info/30">
          <FileCheck className="w-3 h-3 mr-1" />
          সম্পন্ন
        </Badge>
      );
    }
    if (contract.delivery_status === "delivered") {
      return (
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
          <Package className="w-3 h-3 mr-1" />
          ডেলিভারি এসেছে
        </Badge>
      );
    }
    if (contract.delivery_status === "revision_requested") {
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          সংশোধনের অপেক্ষায়
        </Badge>
      );
    }
    if (contract.status === "active") {
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          চলমান
        </Badge>
      );
    }
    return <Badge variant="outline">{contract.status}</Badge>;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">আমার চুক্তিসমূহ</h1>
          <p className="text-muted-foreground">আপনার সক্রিয় ও সম্পন্ন চুক্তি পরিচালনা করুন</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{contracts.filter(c => c.status === "active").length}</p>
                  <p className="text-sm text-muted-foreground">সক্রিয়</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{contracts.filter(c => c.delivery_status === "delivered").length}</p>
                  <p className="text-sm text-muted-foreground">পর্যালোচনার অপেক্ষায়</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{contracts.filter(c => c.status === "completed").length}</p>
                  <p className="text-sm text-muted-foreground">সম্পন্ন</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ৳{contracts.filter(c => c.status === "completed").reduce((sum, c) => sum + Number(c.amount), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">মোট খরচ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">সক্রিয় ({contracts.filter(c => c.status === "active").length})</TabsTrigger>
            <TabsTrigger value="completed">সম্পন্ন ({contracts.filter(c => c.status === "completed").length})</TabsTrigger>
            <TabsTrigger value="all">সব ({contracts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : filteredContracts.length === 0 ? (
              <Card className="glass">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileCheck className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">কোনো চুক্তি নেই</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "active" 
                      ? "আপনার কোনো সক্রিয় চুক্তি নেই"
                      : "এই ক্যাটাগরিতে কোনো চুক্তি নেই"
                    }
                  </p>
                  <Button onClick={() => navigate("/freelancers")}>ফ্রিল্যান্সার খুঁজুন</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredContracts.map((contract) => {
                  const job = jobs[contract.job_id];
                  const profile = profiles[contract.freelancer_id];
                  
                  return (
                    <Card key={contract.id} className="glass hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback>
                                {profile?.first_name?.[0] || <User className="w-5 h-5" />}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-lg">
                                  {job?.title || "চুক্তি"}
                                </h3>
                                {getStatusBadge(contract)}
                              </div>
                              <p className="text-muted-foreground mb-2">
                                ফ্রিল্যান্সার: {profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : "অজানা"}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4 text-primary" />
                                  <span className="font-semibold">৳{contract.amount}</span>
                                  <span className="text-muted-foreground">({contract.contract_type})</span>
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  শুরু {new Date(contract.start_date).toLocaleDateString("bn-BD")}
                                </span>
                                {contract.end_date && (
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <CheckCircle className="w-4 h-4" />
                                    শেষ {new Date(contract.end_date).toLocaleDateString("bn-BD")}
                                  </span>
                                )}
                              </div>

                              {/* Show delivery if exists */}
                              {contract.delivery_text && contract.delivered_at && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  <DeliveryView
                                    deliveryText={contract.delivery_text}
                                    deliveredAt={contract.delivered_at}
                                    deliveryStatus={contract.delivery_status || "delivered"}
                                    isClient={true}
                                    onAccept={() => handleAcceptDelivery(contract)}
                                    onRequestRevision={() => handleRequestRevision(contract)}
                                    isProcessing={isProcessing}
                                  />
                                </div>
                              )}

                              {/* Actions for active contracts without delivery */}
                              {contract.status === "active" && !contract.delivery_text && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                                  <Button variant="outline" size="sm" onClick={() => navigate("/messages")}>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    বার্তা দিন
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {contract.status === "active" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate("/messages")}>
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  ফ্রিল্যান্সারকে বার্তা দিন
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedContract(contract);
                                    setActionType("cancel");
                                  }}
                                  className="text-destructive"
                                >
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  চুক্তি বাতিল করুন
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Review Dialog for completing contract */}
      <Dialog open={showReviewDialog} onOpenChange={(open) => {
        if (!open) {
          setShowReviewDialog(false);
          setSelectedContract(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ডেলিভারি গ্রহণ করুন ও রিভিউ দিন</DialogTitle>
            <DialogDescription>
              ফ্রিল্যান্সারের কাজ সম্পর্কে আপনার মতামত জানান
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <ReviewForm
              contractAmount={selectedContract.amount}
              onSubmit={handleCompleteWithReview}
              onCancel={() => {
                setShowReviewDialog(false);
                setSelectedContract(null);
              }}
              isSubmitting={isSubmittingReview}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!selectedContract && actionType === "cancel"} onOpenChange={() => {
        setSelectedContract(null);
        setActionType(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>চুক্তি বাতিল করবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              এটি চুক্তি বাতিল করবে। ফ্রিল্যান্সারকে জানানো হবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ফিরে যান</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedContract) {
                  handleCancelContract(selectedContract);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              চুক্তি বাতিল করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientContracts;
