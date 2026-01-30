import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { DeliveryForm } from "@/components/contracts/DeliveryForm";
import { DeliveryView } from "@/components/contracts/DeliveryView";
import {
  FileText,
  Calendar,
  DollarSign,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  MoreVertical,
  User,
  Send,
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

interface Contract {
  id: string;
  job_id: string;
  client_id: string;
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

export default function Contracts() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          .eq("freelancer_id", user.id)
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

        // Fetch client profiles
        const clientIds = [...new Set((contractsData || []).map(c => c.client_id))];
        if (clientIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url")
            .in("id", clientIds);
          
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

  const handleDelivery = async (deliveryText: string) => {
    if (!selectedContract) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("contracts")
        .update({
          delivery_text: deliveryText,
          delivered_at: new Date().toISOString(),
          delivery_status: "delivered"
        })
        .eq("id", selectedContract.id);

      if (error) throw error;

      toast({ 
        title: "ডেলিভারি জমা হয়েছে", 
        description: "ক্লায়েন্ট আপনার ডেলিভারি পর্যালোচনা করবেন" 
      });

      setContracts(contracts.map(c =>
        c.id === selectedContract.id
          ? { 
              ...c, 
              delivery_text: deliveryText, 
              delivered_at: new Date().toISOString(),
              delivery_status: "delivered"
            }
          : c
      ));

      setShowDeliveryDialog(false);
      setSelectedContract(null);
    } catch (error: any) {
      toast({
        title: "ত্রুটি হয়েছে",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContracts = contracts.filter(c => {
    if (activeTab === "active") return c.status === "active";
    if (activeTab === "completed") return c.status === "completed";
    if (activeTab === "all") return true;
    return false;
  });

  const getStatusBadge = (contract: Contract) => {
    if (contract.status === "completed") {
      return <Badge variant="secondary">সম্পন্ন</Badge>;
    }
    if (contract.delivery_status === "delivered") {
      return <Badge variant="outline" className="bg-info/10 text-info border-info/30">পর্যালোচনার অপেক্ষায়</Badge>;
    }
    if (contract.delivery_status === "revision_requested") {
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">সংশোধন প্রয়োজন</Badge>;
    }
    if (contract.status === "active") {
      return <Badge variant="outline" className="bg-success/10 text-success border-success/30">চলমান</Badge>;
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
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">আমার চুক্তিসমূহ</h1>
            <p className="text-muted-foreground">আপনার সক্রিয় ও সম্পন্ন চুক্তি পরিচালনা করুন</p>
          </div>
          <Link to="/jobs">
            <Button variant="hero">
              নতুন কাজ খুঁজুন
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">
                {contracts.filter(c => c.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground">সক্রিয় চুক্তি</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">
                ৳{contracts.filter(c => c.status === "active").reduce((sum, c) => sum + Number(c.amount), 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">চলমান আয়</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">
                {contracts.filter(c => c.delivery_status === "delivered").length}
              </p>
              <p className="text-sm text-muted-foreground">পর্যালোচনায়</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-primary">
                ৳{contracts.filter(c => c.status === "completed").reduce((sum, c) => sum + Number(c.amount), 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">মোট আয়</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">সক্রিয় ({contracts.filter(c => c.status === "active").length})</TabsTrigger>
            <TabsTrigger value="completed">সম্পন্ন ({contracts.filter(c => c.status === "completed").length})</TabsTrigger>
            <TabsTrigger value="all">সব ({contracts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : filteredContracts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">কোনো চুক্তি নেই</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "active" 
                      ? "আপনার কোনো সক্রিয় চুক্তি নেই"
                      : "এই ক্যাটাগরিতে কোনো চুক্তি নেই"
                    }
                  </p>
                  <Link to="/jobs">
                    <Button>কাজ খুঁজুন</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredContracts.map((contract) => {
                const job = jobs[contract.job_id];
                const profile = profiles[contract.client_id];

                return (
                  <Card key={contract.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {profile?.first_name?.[0] || <User className="w-5 h-5" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{job?.title || "চুক্তি"}</h3>
                                {getStatusBadge(contract)}
                              </div>
                              <p className="text-muted-foreground">
                                ক্লায়েন্ট: {profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : "অজানা"}
                              </p>
                            </div>
                            {contract.status === "active" && !contract.delivery_text && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => navigate("/messages")}>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    ক্লায়েন্টকে বার্তা দিন
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 mt-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              শুরু {new Date(contract.start_date).toLocaleDateString("bn-BD")}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              ৳{Number(contract.amount).toLocaleString()} ({contract.contract_type})
                            </span>
                            {contract.end_date && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                শেষ {new Date(contract.end_date).toLocaleDateString("bn-BD")}
                              </span>
                            )}
                          </div>

                          {/* Show delivery view if delivered */}
                          {contract.delivery_text && contract.delivered_at && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <DeliveryView
                                deliveryText={contract.delivery_text}
                                deliveredAt={contract.delivered_at}
                                deliveryStatus={contract.delivery_status || "delivered"}
                                isClient={false}
                              />
                            </div>
                          )}

                          {/* Action buttons for active contracts without delivery */}
                          {contract.status === "active" && !contract.delivery_text && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                              <Button variant="outline" size="sm" onClick={() => navigate("/messages")}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                বার্তা
                              </Button>
                              <Button 
                                variant="hero" 
                                size="sm"
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowDeliveryDialog(true);
                                }}
                              >
                                <Package className="h-4 w-4 mr-2" />
                                ডেলিভারি দিন
                              </Button>
                            </div>
                          )}

                          {/* Show resubmit option if revision requested */}
                          {contract.status === "active" && contract.delivery_status === "revision_requested" && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                              <Button variant="outline" size="sm" onClick={() => navigate("/messages")}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                বার্তা
                              </Button>
                              <Button 
                                variant="hero" 
                                size="sm"
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowDeliveryDialog(true);
                                }}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                পুনরায় ডেলিভারি দিন
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />

      {/* Delivery Dialog */}
      <Dialog open={showDeliveryDialog} onOpenChange={(open) => {
        if (!open) {
          setShowDeliveryDialog(false);
          setSelectedContract(null);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>অর্ডার ডেলিভারি দিন</DialogTitle>
            <DialogDescription>
              আপনার সম্পন্ন কাজের বিবরণ দিন। ক্লায়েন্ট এটি পর্যালোচনা করে গ্রহণ করবেন।
            </DialogDescription>
          </DialogHeader>
          <DeliveryForm
            onSubmit={handleDelivery}
            onCancel={() => {
              setShowDeliveryDialog(false);
              setSelectedContract(null);
            }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
