import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Clock,
  FileText,
  MessageSquare,
  Star,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  Target,
  Zap,
  Package
} from 'lucide-react';

interface Contract {
  id: string;
  job_id: string;
  amount: number;
  contract_type: string;
  status: string;
  start_date: string;
  end_date: string | null;
  delivery_text: string | null;
  delivered_at: string | null;
  delivery_status: string | null;
  jobs?: {
    title: string;
    client_id: string;
  };
  client_profile?: {
    first_name: string | null;
    last_name: string | null;
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  budget_type: string;
  skills: string[];
  created_at: string;
  category: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, userRole, isLoading: profileLoading } = useUserProfile();
  
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeContracts: 0,
    proposalsSent: 0,
    jobSuccess: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (userRole === 'freelancer') {
      fetchDashboardData();
    } else if (userRole === 'client') {
      navigate('/client-dashboard');
    }
  }, [user, userRole, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch active contracts for the freelancer
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          *,
          jobs (title, client_id)
        `)
        .eq('freelancer_id', user.id)
        .in('status', ['active', 'in_progress'])
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;

      // For each contract, fetch the client profile
      const contractsWithProfiles = await Promise.all(
        (contractsData || []).map(async (contract) => {
          if (contract.jobs?.client_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', contract.jobs.client_id)
              .single();
            return { ...contract, client_profile: profileData };
          }
          return contract;
        })
      );

      setContracts(contractsWithProfiles);

      // Calculate total earnings from completed contracts
      const { data: completedContracts } = await supabase
        .from('contracts')
        .select('amount')
        .eq('freelancer_id', user.id)
        .eq('status', 'completed');

      const totalEarnings = (completedContracts || []).reduce((sum, c) => sum + Number(c.amount), 0);

      // Fetch proposals count
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select('*')
        .eq('freelancer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!proposalsError) {
        setProposals(proposalsData || []);
      }

      // Count all proposals
      const { count: proposalCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('freelancer_id', user.id);

      // Calculate job success rate
      const { count: acceptedCount } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('freelancer_id', user.id)
        .eq('status', 'accepted');

      const successRate = proposalCount && proposalCount > 0 
        ? Math.round((acceptedCount || 0) / proposalCount * 100) 
        : 0;

      // Fetch portfolio items count
      const { count: portfolioItemsCount } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setPortfolioCount(portfolioItemsCount || 0);

      // Fetch recommended jobs (open jobs)
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!jobsError) {
        setRecommendedJobs(jobsData || []);
      }

      setStats({
        totalEarnings,
        activeContracts: contractsWithProfiles.length,
        proposalsSent: proposalCount || 0,
        jobSuccess: successRate
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const freelancerStats = [
    { label: 'মোট আয়', value: `৳${stats.totalEarnings.toLocaleString()}`, change: stats.totalEarnings > 0 ? '+' : '', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { label: 'সক্রিয় চুক্তি', value: String(stats.activeContracts), icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { label: 'প্রস্তাব পাঠানো', value: String(stats.proposalsSent), icon: FileText, color: 'from-violet-500 to-purple-500' },
    { label: 'সাফল্যের হার', value: `${stats.jobSuccess}%`, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return <Badge variant="success">সক্রিয়</Badge>;
      case 'review':
        return <Badge variant="warning">পর্যালোচনায়</Badge>;
      case 'pending':
        return <Badge variant="secondary">বিচারাধীন</Badge>;
      case 'viewed':
        return <Badge variant="info">দেখা হয়েছে</Badge>;
      case 'shortlisted':
        return <Badge variant="featured">শর্টলিস্টেড</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 4;
    
    if (profile?.avatar_url) completed++;
    if (profile?.first_name && profile?.last_name) completed++;
    if (portfolioCount > 0) completed++;
    // Skills check would need additional table
    completed++; // Placeholder for skills
    
    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const displayName = profile?.first_name 
    ? `${profile.first_name}` 
    : user?.email?.split('@')[0] || 'ব্যবহারকারী';

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="h-40 w-full rounded-3xl mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Welcome Section with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10 mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(0_0%_100%/0.15)_0%,transparent_50%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">স্বাগতম</span>
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-bold mb-2">
                হ্যালো, {displayName}! 👋
              </h1>
              <p className="opacity-90 max-w-md">
                আজ আপনার ফ্রিল্যান্স কাজের অবস্থা দেখুন।
              </p>
            </div>
            <Link to="/jobs">
              <Button variant="secondary" size="lg" className="shadow-floating">
                <Target className="h-5 w-5" />
                কাজ খুঁজুন
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid with Gradient Icons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {freelancerStats.map((stat) => (
            <Card key={stat.label} className="hover-lift border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  {stat.change && stat.change !== '+' && (
                    <Badge variant="success" className="text-xs font-bold">
                      {stat.change}
                    </Badge>
                  )}
                </div>
                <p className="font-display text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Contracts */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="font-display">সক্রিয় চুক্তি</CardTitle>
                </div>
                <Link to="/contracts">
                  <Button variant="ghost" size="sm" className="gap-2">
                    সব দেখুন
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {contracts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>এখনো কোনো সক্রিয় চুক্তি নেই</p>
                    <Link to="/jobs">
                      <Button variant="link" className="mt-2">শুরু করতে কাজ খুঁজুন</Button>
                    </Link>
                  </div>
                ) : (
                  contracts.map((contract) => (
                    <div 
                      key={contract.id}
                      className="p-5 rounded-2xl border border-border/50 bg-muted/30 hover:border-primary/20 hover:bg-muted/50 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {contract.jobs?.title || 'চুক্তি'}
                            </h4>
                            {getStatusBadge(contract.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {contract.client_profile?.first_name 
                              ? `${contract.client_profile.first_name} ${contract.client_profile.last_name || ''}`
                              : 'ক্লায়েন্ট'}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-display font-bold text-lg">৳{Number(contract.amount).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {contract.contract_type === 'hourly' ? 'ঘণ্টায়' : 'নির্দিষ্ট'}
                          </p>
                        </div>
                      </div>

                      {/* Delivery Status */}
                      {contract.delivery_status === 'revision_requested' && (
                        <div className="mt-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                          <div className="flex items-center gap-2 text-warning text-sm font-medium">
                            <AlertCircle className="h-4 w-4" />
                            সংশোধন প্রয়োজন - পুনরায় ডেলিভারি দিন
                          </div>
                        </div>
                      )}
                      {!contract.delivery_text && contract.status === 'active' && (
                        <div className="mt-3 p-3 rounded-lg bg-info/10 border border-info/20">
                          <div className="flex items-center gap-2 text-info text-sm font-medium">
                            <Package className="h-4 w-4" />
                            কাজ সম্পন্ন হলে ডেলিভারি দিন
                          </div>
                        </div>
                      )}
                      {contract.delivery_status === 'delivered' && (
                        <div className="mt-3 p-3 rounded-lg bg-muted border border-border">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Clock className="h-4 w-4" />
                            ক্লায়েন্টের পর্যালোচনার অপেক্ষায়
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          শুরু {new Date(contract.start_date).toLocaleDateString('bn-BD')}
                        </span>
                        <div className="ml-auto flex gap-2">
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Link to={`/contracts/${contract.id}`}>
                            <Button 
                              variant={!contract.delivery_text && contract.status === 'active' ? "hero" : "outline"} 
                              size="sm"
                            >
                              {!contract.delivery_text && contract.status === 'active' ? (
                                <>
                                  <Package className="h-4 w-4 mr-1" />
                                  ডেলিভারি
                                </>
                              ) : (
                                "বিস্তারিত"
                              )}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="font-display">প্রস্তাবিত কাজ</CardTitle>
                </div>
                <Link to="/jobs">
                  <Button variant="ghost" size="sm" className="gap-2">
                    সব দেখুন
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>এখন কোনো কাজ উপলব্ধ নেই</p>
                  </div>
                ) : (
                  recommendedJobs.map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`}>
                      <Card className="group hover:shadow-elevated transition-all duration-300 border-border/50 hover:border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {job.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {job.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {(job.skills || []).slice(0, 3).map((skill) => (
                                  <Badge key={skill} variant="skill" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {(job.skills || []).length > 3 && (
                                  <Badge variant="skill" className="text-xs">
                                    +{job.skills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-semibold text-foreground">
                                ৳{job.budget_min} - ৳{job.budget_max}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 capitalize">
                                {job.budget_type === 'hourly' ? 'ঘণ্টায়' : 'নির্দিষ্ট'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile & Proposals */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display text-base">প্রোফাইল সম্পূর্ণতা</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {profileCompletion}% সম্পূর্ণ
                  </span>
                  <span className="text-sm font-medium">{profileCompletion}/১০০</span>
                </div>
                <Progress value={profileCompletion} className="h-2 mb-4" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`h-4 w-4 ${profile?.avatar_url ? 'text-success' : 'text-muted-foreground'}`} />
                    <span className={profile?.avatar_url ? '' : 'text-muted-foreground'}>প্রোফাইল ছবি যোগ করুন</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`h-4 w-4 ${profile?.first_name ? 'text-success' : 'text-muted-foreground'}`} />
                    <span className={profile?.first_name ? '' : 'text-muted-foreground'}>প্রোফাইল তথ্য সম্পূর্ণ করুন</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`h-4 w-4 ${portfolioCount > 0 ? 'text-success' : 'text-muted-foreground'}`} />
                    <span className={portfolioCount > 0 ? '' : 'text-muted-foreground'}>পোর্টফোলিও যোগ করুন</span>
                  </div>
                </div>
                <Link to="/profile">
                  <Button variant="outline" className="w-full mt-4">
                    প্রোফাইল সম্পাদনা
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Proposals */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="font-display text-base">সাম্প্রতিক প্রস্তাব</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {proposals.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">এখনো কোনো প্রস্তাব নেই</p>
                    <Link to="/jobs">
                      <Button variant="link" size="sm" className="mt-2">কাজে আবেদন করুন</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {proposals.slice(0, 4).map((proposal) => (
                      <div key={proposal.id} className="p-3 rounded-xl bg-muted/50 border border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">প্রস্তাব #{proposal.id.slice(0, 8)}</span>
                          {getStatusBadge(proposal.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          ৳{proposal.bid_amount}
                        </p>
                      </div>
                    ))}
                    <Link to="/proposals">
                      <Button variant="ghost" size="sm" className="w-full">
                        সব প্রস্তাব দেখুন
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display text-base">দ্রুত অ্যাকশন</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/jobs" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    কাজ ব্রাউজ করুন
                  </Button>
                </Link>
                <Link to="/messages" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    বার্তা দেখুন
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    প্রোফাইল আপডেট করুন
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
