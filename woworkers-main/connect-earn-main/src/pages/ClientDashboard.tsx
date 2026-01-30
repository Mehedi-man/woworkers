import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Briefcase, 
  FileText, 
  Users, 
  DollarSign, 
  Plus, 
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
  budget_min: number;
  budget_max: number;
  budget_type: string;
}

interface Proposal {
  id: string;
  bid_amount: number;
  status: string;
  created_at: string;
  job_id: string;
  freelancer_id: string;
}

interface Contract {
  id: string;
  amount: number;
  status: string;
  start_date: string;
  job_id: string;
}

const ClientDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [jobsRes, contractsRes] = await Promise.all([
          supabase
            .from("jobs")
            .select("*")
            .eq("client_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("contracts")
            .select("*")
            .eq("client_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (jobsRes.data) {
          setJobs(jobsRes.data);
          
          // Fetch proposals for all jobs
          const jobIds = jobsRes.data.map(j => j.id);
          if (jobIds.length > 0) {
            const proposalsRes = await supabase
              .from("proposals")
              .select("*")
              .in("job_id", jobIds)
              .order("created_at", { ascending: false });
            
            if (proposalsRes.data) {
              setProposals(proposalsRes.data);
            }
          }
        }

        if (contractsRes.data) {
          setContracts(contractsRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const openJobs = jobs.filter(j => j.status === "open");
  const activeContracts = contracts.filter(c => c.status === "active");
  const pendingProposals = proposals.filter(p => p.status === "pending");
  const totalSpent = contracts
    .filter(c => c.status === "completed")
    .reduce((sum, c) => sum + Number(c.amount), 0);

  const stats = [
    {
      title: "সক্রিয় কাজ",
      value: openJobs.length,
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "বিচারাধীন প্রস্তাব",
      value: pendingProposals.length,
      icon: FileText,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "সক্রিয় চুক্তি",
      value: activeContracts.length,
      icon: Users,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "মোট ব্যয়",
      value: `৳${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

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
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 mb-8">
          <div className="absolute inset-0 gradient-mesh opacity-30" />
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              স্বাগতম! 👋
            </h1>
            <p className="text-white/80 mb-6">
              আপনার কাজ পরিচালনা করুন, প্রস্তাব পর্যালোচনা করুন এবং প্রকল্প ট্র্যাক করুন।
            </p>
            <Button 
              onClick={() => navigate("/post-job")}
              className="bg-white text-primary hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              নতুন কাজ পোস্ট করুন
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="glass hover-lift">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {loading ? (
                  <Skeleton className="h-8 w-20 mb-1" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value}</p>
                )}
                <p className="text-muted-foreground text-sm">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  আপনার কাজ
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/my-jobs")}>
                  সব দেখুন <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">এখনো কোনো কাজ পোস্ট করা হয়নি</p>
                    <Button onClick={() => navigate("/post-job")}>
                      <Plus className="w-4 h-4 mr-2" />
                      প্রথম কাজ পোস্ট করুন
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => {
                      const jobProposals = proposals.filter(p => p.job_id === job.id);
                      return (
                        <div 
                          key={job.id}
                          className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                          onClick={() => navigate(`/my-jobs/${job.id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{job.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {new Date(job.created_at).toLocaleDateString('bn-BD')}
                                </span>
                                <span>
                                  ৳{job.budget_min} - ৳{job.budget_max} / {job.budget_type === 'hourly' ? 'ঘণ্টা' : 'নির্দিষ্ট'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={job.status === "open" ? "default" : "secondary"}>
                                {job.status === "open" ? "খোলা" : job.status === "in_progress" ? "চলমান" : "বন্ধ"}
                              </Badge>
                              {jobProposals.length > 0 && (
                                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                                  {jobProposals.length} প্রস্তাব
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pending Proposals */}
          <div>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-warning" />
                  বিচারাধীন প্রস্তাব
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : pendingProposals.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">কোনো বিচারাধীন প্রস্তাব নেই</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingProposals.slice(0, 5).map((proposal) => {
                      const job = jobs.find(j => j.id === proposal.job_id);
                      return (
                        <div 
                          key={proposal.id}
                          className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                          onClick={() => navigate(`/my-jobs/${proposal.job_id}`)}
                        >
                          <p className="font-medium text-sm truncate">{job?.title || "কাজ"}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-primary font-semibold">৳{proposal.bid_amount}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(proposal.created_at).toLocaleDateString('bn-BD')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {pendingProposals.length > 5 && (
                      <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/my-jobs")}>
                        সব দেখুন ({pendingProposals.length})
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Contracts */}
            <Card className="glass mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-info" />
                  সক্রিয় চুক্তি
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : activeContracts.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">কোনো সক্রিয় চুক্তি নেই</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeContracts.slice(0, 3).map((contract) => {
                      const job = jobs.find(j => j.id === contract.job_id);
                      return (
                        <div 
                          key={contract.id}
                          className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                          onClick={() => navigate(`/client-contracts`)}
                        >
                          <p className="font-medium text-sm truncate">{job?.title || "চুক্তি"}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-primary font-semibold">৳{contract.amount}</span>
                            <Badge variant="outline" className="bg-info/10 text-info border-info/30">
                              সক্রিয়
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientDashboard;
