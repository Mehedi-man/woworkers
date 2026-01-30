import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DeliveryForm } from '@/components/contracts/DeliveryForm';
import { DeliveryView } from '@/components/contracts/DeliveryView';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  DollarSign,
  User,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  Package,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

interface ContractDetail {
  id: string;
  job_id: string;
  client_id: string;
  freelancer_id: string;
  proposal_id: string | null;
  amount: number;
  contract_type: string;
  status: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  delivery_text: string | null;
  delivered_at: string | null;
  delivery_status: string | null;
  jobs?: {
    title: string;
    description: string;
    category: string;
    skills: string[];
  };
  client_profile?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
  freelancer_profile?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchContract();
    }
  }, [id, user]);

  const fetchContract = async () => {
    if (!id || !user) return;

    setLoading(true);
    try {
      const { data: contractData, error } = await supabase
        .from('contracts')
        .select(`
          *,
          jobs (title, description, category, skills)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch profiles
      const [clientProfile, freelancerProfile] = await Promise.all([
        supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', contractData.client_id)
          .single(),
        supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', contractData.freelancer_id)
          .single()
      ]);

      setContract({
        ...contractData,
        client_profile: clientProfile.data,
        freelancer_profile: freelancerProfile.data
      });
    } catch (error: any) {
      console.error('Error fetching contract:', error);
      toast({
        title: 'ত্রুটি',
        description: 'চুক্তির বিবরণ লোড করতে ব্যর্থ হয়েছে।',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, deliveryStatus?: string | null) => {
    if (status === 'completed') {
      return <Badge variant="outline" className="bg-info/10 text-info border-info/30">সম্পন্ন</Badge>;
    }
    if (deliveryStatus === 'delivered') {
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">পর্যালোচনার অপেক্ষায়</Badge>;
    }
    if (deliveryStatus === 'revision_requested') {
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">সংশোধন প্রয়োজন</Badge>;
    }
    switch (status) {
      case 'active':
      case 'in_progress':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">চলমান</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">বাতিল</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">অপেক্ষমান</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDelivery = async (deliveryText: string) => {
    if (!contract) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          delivery_text: deliveryText,
          delivered_at: new Date().toISOString(),
          delivery_status: 'delivered'
        })
        .eq('id', contract.id);

      if (error) throw error;

      toast({ 
        title: 'ডেলিভারি জমা হয়েছে', 
        description: 'ক্লায়েন্ট আপনার ডেলিভারি পর্যালোচনা করবেন' 
      });

      setContract({
        ...contract,
        delivery_text: deliveryText,
        delivered_at: new Date().toISOString(),
        delivery_status: 'delivered'
      });

      setShowDeliveryDialog(false);
    } catch (error: any) {
      toast({
        title: 'ত্রুটি হয়েছে',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptDelivery = () => {
    setShowReviewDialog(true);
  };

  const handleRequestRevision = async () => {
    if (!contract) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ delivery_status: 'revision_requested' })
        .eq('id', contract.id);

      if (error) throw error;

      toast({ 
        title: 'সংশোধনের অনুরোধ পাঠানো হয়েছে', 
        description: 'ফ্রিল্যান্সার পুনরায় ডেলিভারি দেবেন' 
      });

      setContract({
        ...contract,
        delivery_status: 'revision_requested'
      });
    } catch (error: any) {
      toast({
        title: 'ত্রুটি হয়েছে',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteWithReview = async (rating: number, comment: string) => {
    if (!contract || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .rpc('complete_contract_atomic', {
          _contract_id: contract.id,
          _rating: rating,
          _comment: comment
        });

      if (error) throw error;

      toast({ title: 'চুক্তি সম্পন্ন হয়েছে', description: 'আপনার রিভিউ জমা দেওয়া হয়েছে' });
      
      setContract({
        ...contract,
        status: 'completed',
        end_date: new Date().toISOString(),
        delivery_status: 'accepted'
      });
      
      setShowReviewDialog(false);
    } catch (error: any) {
      toast({ 
        title: 'ত্রুটি হয়েছে', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isClient = user?.id === contract?.client_id;
  const isFreelancer = user?.id === contract?.freelancer_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-64 rounded-xl mb-6" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">চুক্তি পাওয়া যায়নি</h1>
            <p className="text-muted-foreground mb-6">আপনি যে চুক্তিটি খুঁজছেন তা বিদ্যমান নেই বা আপনার প্রবেশাধিকার নেই।</p>
            <Link to="/contracts">
              <Button>চুক্তিসমূহে ফিরে যান</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const otherParty = isClient ? contract.freelancer_profile : contract.client_profile;
  const otherPartyName = otherParty?.first_name 
    ? `${otherParty.first_name} ${otherParty.last_name || ''}`
    : (isClient ? 'ফ্রিল্যান্সার' : 'ক্লায়েন্ট');

  const canDeliver = isFreelancer && contract.status === 'active' && 
    (!contract.delivery_status || contract.delivery_status === 'pending' || contract.delivery_status === 'revision_requested');

  const showDeliveryView = contract.delivery_text && contract.delivered_at;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            পেছনে যান
          </Button>

          {/* Contract Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{contract.jobs?.title || 'চুক্তি'}</h1>
                    {getStatusBadge(contract.status, contract.delivery_status)}
                  </div>
                  <p className="text-muted-foreground">{contract.jobs?.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    ৳{Number(contract.amount).toLocaleString('bn-BD')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {contract.contract_type === 'fixed' ? 'নির্দিষ্ট মূল্য' : 'ঘণ্টাভিত্তিক'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>শুরু: {format(new Date(contract.start_date), 'd MMM yyyy', { locale: bn })}</span>
                </div>
                {contract.end_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>শেষ: {format(new Date(contract.end_date), 'd MMM yyyy', { locale: bn })}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    কাজের বিবরণ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {contract.jobs?.description || 'কোনো বিবরণ নেই।'}
                  </p>
                  
                  {contract.jobs?.skills && contract.jobs.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">প্রয়োজনীয় দক্ষতা</p>
                      <div className="flex flex-wrap gap-2">
                        {contract.jobs.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Section */}
              {showDeliveryView && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      ডেলিভারি
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeliveryView
                      deliveryText={contract.delivery_text!}
                      deliveredAt={contract.delivered_at!}
                      deliveryStatus={contract.delivery_status || 'delivered'}
                      isClient={isClient}
                      onAccept={handleAcceptDelivery}
                      onRequestRevision={handleRequestRevision}
                      isProcessing={isProcessing}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Freelancer Delivery Button */}
              {canDeliver && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-lg mb-2">
                        {contract.delivery_status === 'revision_requested' 
                          ? 'সংশোধন করে পুনরায় জমা দিন'
                          : 'আপনার কাজ ডেলিভারি দিন'
                        }
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {contract.delivery_status === 'revision_requested'
                          ? 'ক্লায়েন্ট সংশোধন চেয়েছেন। প্রয়োজনীয় পরিবর্তন করে পুনরায় জমা দিন।'
                          : 'কাজ শেষ হলে ডেলিভারি জমা দিন যাতে ক্লায়েন্ট পর্যালোচনা করতে পারেন।'
                        }
                      </p>
                      <Button variant="hero" onClick={() => setShowDeliveryDialog(true)}>
                        {contract.delivery_status === 'revision_requested' ? (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            পুনরায় ডেলিভারি দিন
                          </>
                        ) : (
                          <>
                            <Package className="h-4 w-4 mr-2" />
                            ডেলিভারি দিন
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    সময়রেখা
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">চুক্তি তৈরি হয়েছে</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(contract.created_at), 'EEEE, d MMMM yyyy', { locale: bn })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">কাজ শুরু হয়েছে</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(contract.start_date), 'EEEE, d MMMM yyyy', { locale: bn })}
                        </p>
                      </div>
                    </div>
                    {contract.delivered_at && (
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                          <Package className="h-4 w-4 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">ডেলিভারি জমা দেওয়া হয়েছে</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(contract.delivered_at), 'EEEE, d MMMM yyyy', { locale: bn })}
                          </p>
                        </div>
                      </div>
                    )}
                    {contract.status === 'completed' && contract.end_date && (
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">চুক্তি সম্পন্ন</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(contract.end_date), 'EEEE, d MMMM yyyy', { locale: bn })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Other Party */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isClient ? 'ফ্রিল্যান্সার' : 'ক্লায়েন্ট'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    {otherParty?.avatar_url ? (
                      <img 
                        src={otherParty.avatar_url}
                        alt={otherPartyName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{otherPartyName}</p>
                      <p className="text-sm text-muted-foreground">
                        {isClient ? 'ফ্রিল্যান্সার' : 'ক্লায়েন্ট'}
                      </p>
                    </div>
                  </div>
                  <Link to="/messages">
                    <Button variant="outline" className="w-full mt-4">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      বার্তা পাঠান
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Contract Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">চুক্তির সারসংক্ষেপ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">চুক্তির ধরন</span>
                    <span className="font-medium">
                      {contract.contract_type === 'fixed' ? 'নির্দিষ্ট মূল্য' : 'ঘণ্টাভিত্তিক'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">পরিমাণ</span>
                    <span className="font-medium">৳{Number(contract.amount).toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">অবস্থা</span>
                    {getStatusBadge(contract.status, contract.delivery_status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">সময়কাল</span>
                    <span className="font-medium">
                      {contract.end_date 
                        ? `${Math.ceil((new Date(contract.end_date).getTime() - new Date(contract.start_date).getTime()) / (1000 * 60 * 60 * 24))} দিন`
                        : 'চলমান'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Delivery Dialog */}
      <Dialog open={showDeliveryDialog} onOpenChange={(open) => {
        if (!open) setShowDeliveryDialog(false);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {contract.delivery_status === 'revision_requested' 
                ? 'পুনরায় ডেলিভারি দিন'
                : 'অর্ডার ডেলিভারি দিন'
              }
            </DialogTitle>
            <DialogDescription>
              আপনার কাজের বিবরণ দিন যাতে ক্লায়েন্ট বুঝতে পারেন কি ডেলিভার করা হয়েছে।
            </DialogDescription>
          </DialogHeader>
          <DeliveryForm
            onSubmit={handleDelivery}
            onCancel={() => setShowDeliveryDialog(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={(open) => {
        if (!open) setShowReviewDialog(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ডেলিভারি গ্রহণ করুন ও রিভিউ দিন</DialogTitle>
            <DialogDescription>
              ফ্রিল্যান্সারের কাজ সম্পর্কে আপনার মতামত জানান
            </DialogDescription>
          </DialogHeader>
          <ReviewForm
            contractAmount={contract.amount}
            onSubmit={handleCompleteWithReview}
            onCancel={() => setShowReviewDialog(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
