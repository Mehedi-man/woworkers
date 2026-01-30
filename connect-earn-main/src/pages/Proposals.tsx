import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import {
  FileText,
  Clock,
  DollarSign,
  ArrowRight,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertCircle,
  Briefcase
} from 'lucide-react';

interface Proposal {
  id: string;
  job_id: string;
  bid_amount: number;
  status: string;
  cover_letter: string;
  timeline: string | null;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  budget_type: string;
  category: string;
}

export default function Proposals() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [jobs, setJobs] = useState<Record<string, Job>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!user) return;

      try {
        const { data: proposalsData, error: proposalsError } = await supabase
          .from("proposals")
          .select("*")
          .eq("freelancer_id", user.id)
          .order("created_at", { ascending: false });

        if (proposalsError) throw proposalsError;
        setProposals(proposalsData || []);

        // Fetch associated jobs
        const jobIds = [...new Set((proposalsData || []).map(p => p.job_id))];
        if (jobIds.length > 0) {
          const { data: jobsData } = await supabase
            .from("jobs")
            .select("id, title, budget_type, category")
            .in("id", jobIds);

          const jobsMap: Record<string, Job> = {};
          (jobsData || []).forEach(j => {
            jobsMap[j.id] = j;
          });
          setJobs(jobsMap);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProposals();
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'viewed':
        return <Badge variant="info">Viewed</Badge>;
      case 'shortlisted':
        return <Badge variant="featured">Shortlisted</Badge>;
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filterByStatus = (statuses: string[]) => 
    proposals.filter(p => statuses.includes(p.status));

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
            <h1 className="font-display text-2xl md:text-3xl font-bold">My Proposals</h1>
            <p className="text-muted-foreground">Track and manage your submitted proposals</p>
          </div>
          <Link to="/jobs">
            <Button variant="hero">
              Find Jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              {loading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-primary">{proposals.length}</p>
              )}
              <p className="text-sm text-muted-foreground">Total Sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {loading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {filterByStatus(['pending']).length}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {loading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-info">
                  {filterByStatus(['viewed']).length}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Viewed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {loading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-success">
                  {filterByStatus(['accepted']).length}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {loading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-destructive">
                  {filterByStatus(['rejected']).length}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Declined</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({proposals.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({filterByStatus(['pending', 'viewed']).length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({filterByStatus(['accepted']).length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({filterByStatus(['rejected']).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : proposals.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No proposals yet</h3>
                  <p className="text-muted-foreground mb-4">Start applying to jobs to see your proposals here</p>
                  <Link to="/jobs">
                    <Button variant="hero">Browse Jobs</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              proposals.map((proposal) => {
                const job = jobs[proposal.job_id];
                return (
                  <Card key={proposal.id} className="hover:shadow-soft transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center shrink-0">
                          <Briefcase className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg truncate">
                                  {job?.title || 'Job'}
                                </h3>
                                {getStatusBadge(proposal.status)}
                              </div>
                              {job?.category && (
                                <p className="text-muted-foreground text-sm">{job.category}</p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-semibold text-lg">
                                ${proposal.bid_amount}
                                {job?.budget_type === 'hourly' && <span className="text-sm font-normal">/hr</span>}
                              </p>
                              <p className="text-sm text-muted-foreground">{job?.budget_type || 'fixed'}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Submitted {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                            </span>
                            {proposal.timeline && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {proposal.timeline}
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                            {proposal.cover_letter}
                          </p>

                          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                            <Link to={`/jobs/${proposal.job_id}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                View Job
                              </Button>
                            </Link>
                            {proposal.status === 'accepted' && (
                              <Button variant="hero" size="sm">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message Client
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {filterByStatus(['pending', 'viewed']).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No active proposals</h3>
                  <p className="text-muted-foreground mb-4">Your pending proposals will appear here</p>
                </CardContent>
              </Card>
            ) : (
              filterByStatus(['pending', 'viewed']).map((proposal) => {
                const job = jobs[proposal.job_id];
                return (
                  <Card key={proposal.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job?.title || 'Job'}</h3>
                            {getStatusBadge(proposal.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${proposal.bid_amount}{job?.budget_type === 'hourly' && '/hr'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {filterByStatus(['accepted']).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Accepted Proposals</h3>
                  <p className="text-muted-foreground mb-4">Keep applying to find your next gig!</p>
                  <Link to="/jobs">
                    <Button variant="hero">Browse Jobs</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filterByStatus(['accepted']).map((proposal) => {
                const job = jobs[proposal.job_id];
                return (
                  <Card key={proposal.id} className="border-success/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-success" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job?.title || 'Job'}</h3>
                            {getStatusBadge(proposal.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Contract started
                          </p>
                        </div>
                        <Button variant="hero" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            {filterByStatus(['rejected']).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No archived proposals</h3>
                </CardContent>
              </Card>
            ) : (
              filterByStatus(['rejected']).map((proposal) => {
                const job = jobs[proposal.job_id];
                return (
                  <Card key={proposal.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                          <XCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job?.title || 'Job'}</h3>
                            {getStatusBadge(proposal.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">${proposal.bid_amount}</p>
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
    </div>
  );
}
