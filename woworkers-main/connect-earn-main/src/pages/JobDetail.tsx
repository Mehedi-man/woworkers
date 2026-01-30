import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useConversations } from '@/hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { proposalSchema, validateData } from '@/lib/validations';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[] | null;
  budget_type: string;
  budget_min: number;
  budget_max: number;
  duration: string | null;
  experience_level: string | null;
  status: string;
  created_at: string;
  is_remote: boolean | null;
  location: string | null;
  client_id: string;
}
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  DollarSign, 
  Clock, 
  MapPin, 
  Star, 
  Users,
  Verified,
  Flag,
  CheckCircle,
  Briefcase,
  Sparkles,
  Send,
  MessageSquare
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { startConversation } = useConversations(user?.id);
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [proposalData, setProposalData] = useState({
    bidAmount: '',
    coverLetter: '',
    timeline: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalCount, setProposalCount] = useState(0);

  const handleMessageClient = async () => {
    if (!job || !id) return;
    const conversationId = await startConversation(job.client_id, id, false);
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
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        const { data: jobData, error: jobError } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .single();

        if (jobError) throw jobError;
        setJob(jobData);

        // Fetch proposal count
        const { count } = await supabase
          .from("proposals")
          .select("*", { count: "exact", head: true })
          .eq("job_id", id);

        setProposalCount(count || 0);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmitProposal = async () => {
    if (!user) {
      toast({ 
        title: "লগইন করুন", 
        description: "প্রস্তাব জমা দিতে আপনাকে লগইন করতে হবে",
        variant: "destructive" 
      });
      navigate("/auth");
      return;
    }

    // Validate input data with Zod schema
    const bidAmountNum = parseFloat(proposalData.bidAmount);
    const validation = validateData(proposalSchema, {
      bidAmount: isNaN(bidAmountNum) ? 0 : bidAmountNum,
      coverLetter: proposalData.coverLetter,
      timeline: proposalData.timeline || null,
    });

    if (!validation.success) {
      toast({ 
        title: "ভ্যালিডেশন ত্রুটি", 
        description: validation.error,
        variant: "destructive" 
      });
      return;
    }

    const validatedData = validation.data;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("proposals").insert({
        job_id: id,
        freelancer_id: user.id,
        bid_amount: validatedData.bidAmount,
        cover_letter: validatedData.coverLetter.trim(),
        timeline: validatedData.timeline?.trim() || null,
        status: "pending",
      });

      if (error) throw error;

      toast({ 
        title: "প্রস্তাব জমা হয়েছে!", 
        description: "ক্লায়েন্ট আপনার প্রস্তাব পর্যালোচনা করবেন।" 
      });
      setProposalData({ bidAmount: '', coverLetter: '', timeline: '' });
      setProposalCount(prev => prev + 1);
    } catch (error: any) {
      toast({ 
        title: "প্রস্তাব জমা ব্যর্থ", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBudget = () => {
    if (!job) return '';
    if (job.budget_type === 'hourly') {
      return `৳${job.budget_min} - ৳${job.budget_max}/ঘণ্টা`;
    }
    return `৳${job.budget_min.toLocaleString()} - ৳${job.budget_max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">কাজ পাওয়া যায়নি</h1>
          <Button onClick={() => navigate("/jobs")}>কাজে ফিরে যান</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb with gradient background */}
        <div className="relative overflow-hidden bg-muted/30 border-b border-border/50">
          <div className="absolute inset-0 gradient-mesh opacity-30" />
          <div className="container py-5 relative">
            <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              কাজে ফিরে যান
            </Link>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                <div className="h-1.5 gradient-hero" />
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant={job.budget_type === 'hourly' ? 'info' : 'success'}>
                        {job.budget_type === 'hourly' ? 'ঘণ্টায়' : 'নির্দিষ্ট মূল্য'}
                      </Badge>
                      {job.experience_level && (
                        <Badge variant="outline" className="capitalize">
                          {job.experience_level === 'entry' ? 'প্রবেশ স্তর' : job.experience_level === 'intermediate' ? 'মধ্যবর্তী' : 'বিশেষজ্ঞ'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent">
                        <Bookmark className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-5">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      পোস্ট হয়েছে {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: bn })}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {job.is_remote ? 'অনলাইন' : job.location || 'সর্বত্র'}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {proposalCount} প্রস্তাব
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                      <p className="text-sm text-muted-foreground mb-2">বাজেট</p>
                      <p className="font-display font-bold text-xl flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        {formatBudget()}
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-muted/50 border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">সময়কাল</p>
                      <p className="font-display font-bold text-xl">{job.duration || 'উল্লেখ নেই'}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-muted/50 border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">অভিজ্ঞতা</p>
                      <p className="font-display font-bold text-xl capitalize">{job.experience_level === 'entry' ? 'প্রবেশ স্তর' : job.experience_level === 'intermediate' ? 'মধ্যবর্তী' : job.experience_level === 'expert' ? 'বিশেষজ্ঞ' : 'যেকোনো'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-display">কাজের বিবরণ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {job.description}
                    {'\n\n'}
                    আমরা একজন প্রতিভাবান পেশাদার খুঁজছি আমাদের প্রকল্পে যোগ দিতে। আদর্শ প্রার্থীর থাকা উচিত:
                    {'\n\n'}
                    • প্রয়োজনীয় প্রযুক্তিতে শক্তিশালী অভিজ্ঞতা
                    {'\n'}• চমৎকার যোগাযোগ দক্ষতা
                    {'\n'}• স্বাধীনভাবে কাজ করার এবং সময়সীমা পূরণের ক্ষমতা
                    {'\n'}• পূর্ববর্তী কাজের পোর্টফোলিও
                    {'\n\n'}
                    এটি একটি ক্রমবর্ধমান কোম্পানির সাথে উত্তেজনাপূর্ণ প্রকল্পে কাজ করার একটি দুর্দান্ত সুযোগ। আমরা প্রতিযোগিতামূলক রেট এবং সঠিক প্রার্থীর জন্য দীর্ঘমেয়াদী সহযোগিতার সম্ভাবনা অফার করি।
                  </p>
                </CardContent>
              </Card>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-display">প্রয়োজনীয় দক্ষতা</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="skill" className="text-sm py-2 px-4 rounded-xl">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Activity */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-display">এই কাজে কার্যকলাপ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                      <p className="font-display text-3xl font-bold text-primary">{proposalCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">প্রস্তাব</p>
                    </div>
                    <div className="text-center p-5 rounded-2xl bg-muted/50 border border-border/50">
                      <p className="font-display text-3xl font-bold text-foreground">-</p>
                      <p className="text-sm text-muted-foreground mt-1">ইন্টারভিউ</p>
                    </div>
                    <div className="text-center p-5 rounded-2xl bg-muted/50 border border-border/50">
                      <p className="font-display text-3xl font-bold text-foreground">{job.status === 'in-progress' ? '১' : '০'}</p>
                      <p className="text-sm text-muted-foreground mt-1">নিয়োগকৃত</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-24 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                <div className="h-1.5 gradient-hero" />
                <CardContent className="p-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="hero" size="lg" className="w-full mb-4">
                        <Sparkles className="h-5 w-5" />
                        এখনই আবেদন করুন
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="font-display text-xl">প্রস্তাব জমা দিন</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-5 mt-4">
                        <div>
                          <Label className="font-medium">আপনার বিড</Label>
                          <div className="flex gap-2 mt-2">
                            <Input 
                              type="number" 
                              placeholder={job.budget_type === 'hourly' ? '৫০০' : '১০০০০'} 
                              className="rounded-xl"
                              value={proposalData.bidAmount}
                              onChange={(e) => setProposalData(prev => ({ ...prev, bidAmount: e.target.value }))}
                            />
                            {job.budget_type === 'hourly' && (
                              <span className="flex items-center text-muted-foreground px-3">/ঘণ্টা</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium">কভার লেটার</Label>
                          <Textarea 
                            placeholder="নিজেকে পরিচয় করান এবং ব্যাখ্যা করুন কেন আপনি এই কাজের জন্য সেরা..."
                            className="mt-2 min-h-32 rounded-xl"
                            value={proposalData.coverLetter}
                            onChange={(e) => setProposalData(prev => ({ ...prev, coverLetter: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label className="font-medium">আনুমানিক সময়কাল</Label>
                          <Input 
                            placeholder="যেমন, ২ সপ্তাহ" 
                            className="mt-2 rounded-xl"
                            value={proposalData.timeline}
                            onChange={(e) => setProposalData(prev => ({ ...prev, timeline: e.target.value }))}
                          />
                        </div>
                        <Button 
                          variant="hero" 
                          className="w-full"
                          onClick={handleSubmitProposal}
                          disabled={isSubmitting}
                        >
                          <Send className="h-4 w-4" />
                          {isSubmitting ? 'জমা হচ্ছে...' : 'প্রস্তাব জমা দিন'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full rounded-xl mb-2">
                    <Bookmark className="h-4 w-4" />
                    সেভ করুন
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl"
                    onClick={handleMessageClient}
                  >
                    <MessageSquare className="h-4 w-4" />
                    ক্লায়েন্টকে বার্তা দিন
                  </Button>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">ক্লায়েন্ট সম্পর্কে</h4>
                        <p className="text-sm text-muted-foreground">যাচাইকৃত ক্লায়েন্ট</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>পেমেন্ট পদ্ধতি যাচাইকৃত</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-warning" />
                        <span>৪.৯ গড় রেটিং</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-info" />
                        <span>১০+ কাজ পোস্ট করা হয়েছে</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
