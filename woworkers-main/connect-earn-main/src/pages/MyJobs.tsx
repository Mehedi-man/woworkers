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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  Plus, 
  Clock,
  DollarSign,
  FileText,
  MoreVertical,
  Trash2,
  Edit,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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
}

interface Proposal {
  id: string;
  job_id: string;
  status: string;
}

const MyJobs = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      try {
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false });

        if (jobsError) throw jobsError;
        setJobs(jobsData || []);

        // Fetch proposals for all jobs
        const jobIds = (jobsData || []).map(j => j.id);
        if (jobIds.length > 0) {
          const { data: proposalsData } = await supabase
            .from("proposals")
            .select("id, job_id, status")
            .in("job_id", jobIds);
          
          setProposals(proposalsData || []);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) throw error;

      setJobs(jobs.filter(j => j.id !== jobId));
      toast({ title: "Job deleted successfully" });
    } catch (error: any) {
      toast({ title: "Failed to delete job", description: error.message, variant: "destructive" });
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (activeTab === "all") return true;
    return job.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-success/10 text-success border-success/30";
      case "in-progress": return "bg-info/10 text-info border-info/30";
      case "completed": return "bg-muted text-muted-foreground";
      case "cancelled": return "bg-destructive/10 text-destructive border-destructive/30";
      default: return "";
    }
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="text-muted-foreground">Manage and track your job postings</p>
          </div>
          <Button onClick={() => navigate("/post-job")}>
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({jobs.length})</TabsTrigger>
            <TabsTrigger value="open">Open ({jobs.filter(j => j.status === "open").length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({jobs.filter(j => j.status === "in-progress").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({jobs.filter(j => j.status === "completed").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="glass">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "all" 
                      ? "You haven't posted any jobs yet"
                      : `No ${activeTab.replace("-", " ")} jobs`
                    }
                  </p>
                  {activeTab === "all" && (
                    <Button onClick={() => navigate("/post-job")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Post Your First Job
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => {
                  const jobProposals = proposals.filter(p => p.job_id === job.id);
                  const pendingProposals = jobProposals.filter(p => p.status === "pending");
                  
                  return (
                    <Card key={job.id} className="glass hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 cursor-pointer" onClick={() => navigate(`/my-jobs/${job.id}`)}>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <Badge variant="outline" className={getStatusColor(job.status)}>
                                {job.status.replace("-", " ")}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                              {job.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                ${job.budget_min} - ${job.budget_max} / {job.budget_type}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {new Date(job.created_at).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Briefcase className="w-4 h-4" />
                                {job.category}
                              </span>
                              {pendingProposals.length > 0 && (
                                <Badge variant="default" className="bg-warning/10 text-warning hover:bg-warning/20">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {pendingProposals.length} new proposal{pendingProposals.length !== 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>

                            {job.skills && job.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {job.skills.slice(0, 5).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {job.skills.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{job.skills.length - 5}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/my-jobs/${job.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/edit-job/${job.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Job
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteJob(job.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
    </div>
  );
};

export default MyJobs;
