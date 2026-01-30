import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Camera,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Shield,
  Mail,
  Calendar,
  Image,
  X
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, userRole, isLoading, updateProfile, isUpdating } = useUserProfile();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [newPortfolioImageUrl, setNewPortfolioImageUrl] = useState('');
  const [isSubmittingPortfolio, setIsSubmittingPortfolio] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    jobsCompleted: 0,
    totalEarned: 0,
    rating: null as number | null
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Populate form with profile data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  // Fetch portfolio items
  useEffect(() => {
    if (user) {
      fetchPortfolioItems();
      fetchStats();
    }
  }, [user]);

  const fetchPortfolioItems = async () => {
    if (!user) return;
    
    setPortfolioLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get completed contracts count
      const { count: completedCount } = await supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('freelancer_id', user.id)
        .eq('status', 'completed');

      // Get total earnings
      const { data: contracts } = await supabase
        .from('contracts')
        .select('amount')
        .eq('freelancer_id', user.id)
        .eq('status', 'completed');

      const totalEarned = (contracts || []).reduce((sum, c) => sum + Number(c.amount), 0);

      setStats({
        jobsCompleted: completedCount || 0,
        totalEarned,
        rating: null
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddPortfolioItem = async () => {
    if (!user) {
      toast({
        title: 'প্রমাণীকরণ প্রয়োজন',
        description: 'পোর্টফোলিও আইটেম যোগ করতে লগইন করুন।',
        variant: 'destructive'
      });
      return;
    }

    // Validate input using portfolioItemSchema
    const { validateData, portfolioItemSchema } = await import('@/lib/validations');
    const validationResult = validateData(portfolioItemSchema, {
      title: newPortfolioTitle,
      description: newPortfolioDescription || null,
      imageUrl: newPortfolioImageUrl
    });

    if (!validationResult.success) {
      toast({
        title: 'ভ্যালিডেশন ত্রুটি',
        description: validationResult.error,
        variant: 'destructive'
      });
      return;
    }

    setIsSubmittingPortfolio(true);
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .insert({
          user_id: user.id,
          title: validationResult.data.title,
          description: validationResult.data.description,
          image_url: validationResult.data.imageUrl
        });

      if (error) throw error;

      toast({
        title: 'পোর্টফোলিও আইটেম যোগ হয়েছে',
        description: 'আপনার পোর্টফোলিও আইটেম সফলভাবে যোগ হয়েছে।'
      });

      setNewPortfolioTitle('');
      setNewPortfolioDescription('');
      setNewPortfolioImageUrl('');
      setIsAddingPortfolio(false);
      fetchPortfolioItems();
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingPortfolio(false);
    }
  };

  const handleDeletePortfolioItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'মুছে ফেলা হয়েছে',
        description: 'পোর্টফোলিও আইটেম মুছে ফেলা হয়েছে।'
      });

      fetchPortfolioItems();
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleSaveProfile = () => {
    updateProfile({
      first_name: firstName,
      last_name: lastName,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFirstName(profile?.first_name || '');
    setLastName(profile?.last_name || '');
    setIsEditing(false);
  };

  // Mock data for skills (would need separate table)
  const skills = ['শিশু যত্ন', 'রান্না', 'ঘর পরিষ্কার', 'বয়স্ক যত্ন', 'টিউটরিং'];

  const certifications = [
    { id: '1', name: 'সিপিআর ও প্রাথমিক চিকিৎসা সার্টিফায়েড', issuer: 'রেড ক্রস', year: '২০২৩' },
    { id: '2', name: 'শিশু উন্নয়ন বিশেষজ্ঞ', issuer: 'এনএইসি', year: '২০২২' },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="w-32 h-32 rounded-2xl" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.first_name || user?.email?.split('@')[0] || 'ব্যবহারকারী';

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })
    : 'সম্প্রতি যোগ দিয়েছেন';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url}
                      alt="প্রোফাইল"
                      className="w-32 h-32 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <User className="h-16 w-16 text-primary" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                        {displayName}
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </h1>
                      <p className="text-muted-foreground capitalize">
                        {userRole === 'freelancer' ? 'কর্মী' : userRole === 'client' ? 'ক্লায়েন্ট' : 'সদস্য'}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? 'বাতিল' : 'প্রোফাইল সম্পাদনা'}
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      সদস্য {memberSince} থেকে
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="success" className="gap-1">
                      <Shield className="h-3 w-3" />
                      যাচাইকৃত {userRole === 'freelancer' ? 'কর্মী' : 'ক্লায়েন্ট'}
                    </Badge>
                    {userRole === 'freelancer' && (
                      <Badge variant="featured">সক্রিয়</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="about">সম্পর্কে</TabsTrigger>
              {userRole === 'freelancer' && (
                <>
                  <TabsTrigger value="skills">দক্ষতা ও সেবা</TabsTrigger>
                  <TabsTrigger value="portfolio">পোর্টফোলিও</TabsTrigger>
                  <TabsTrigger value="certifications">সার্টিফিকেশন</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>প্রোফাইল তথ্য</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">প্রথম নাম</Label>
                          <Input 
                            id="firstName" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="আপনার প্রথম নাম দিন"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">শেষ নাম</Label>
                          <Input 
                            id="lastName" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="আপনার শেষ নাম দিন"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">ইমেইল</Label>
                        <Input 
                          id="email" 
                          value={user.email || ''} 
                          disabled 
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          ইমেইল এখান থেকে পরিবর্তন করা যায় না। আপডেট করতে সাপোর্টে যোগাযোগ করুন।
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="hero" 
                          onClick={handleSaveProfile}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          বাতিল
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">প্রথম নাম</p>
                          <p className="font-medium">{profile?.first_name || 'সেট করা নেই'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">শেষ নাম</p>
                          <p className="font-medium">{profile?.last_name || 'সেট করা নেই'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">ইমেইল</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">ভূমিকা</p>
                          <p className="font-medium capitalize">{userRole === 'freelancer' ? 'কর্মী' : userRole === 'client' ? 'ক্লায়েন্ট' : 'সেট করা নেই'}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold text-primary">{stats.jobsCompleted}</p>
                          <p className="text-sm text-muted-foreground">
                            {userRole === 'freelancer' ? 'কাজ সম্পন্ন' : 'কাজ পোস্ট'}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold text-primary">৳{stats.totalEarned.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {userRole === 'freelancer' ? 'মোট আয়' : 'মোট ব্যয়'}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <p className="text-2xl font-bold text-primary">{stats.rating || '--'}</p>
                          <p className="text-sm text-muted-foreground">রেটিং</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {userRole === 'freelancer' && (
              <>
                <TabsContent value="skills">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>দক্ষতা ও সেবা</CardTitle>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        দক্ষতা যোগ করুন
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="skill" className="text-sm py-2 px-4">
                            {skill}
                            {isEditing && (
                              <X className="h-3 w-3 ml-2 cursor-pointer" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="portfolio">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>পোর্টফোলিও</CardTitle>
                      <Dialog open={isAddingPortfolio} onOpenChange={setIsAddingPortfolio}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            আইটেম যোগ করুন
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>পোর্টফোলিও আইটেম যোগ করুন</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label>শিরোনাম</Label>
                              <Input 
                                placeholder="প্রকল্পের শিরোনাম"
                                value={newPortfolioTitle}
                                onChange={(e) => setNewPortfolioTitle(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>বিবরণ</Label>
                              <Textarea 
                                placeholder="প্রকল্পের বিবরণ"
                                value={newPortfolioDescription}
                                onChange={(e) => setNewPortfolioDescription(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>ছবির URL</Label>
                              <Input 
                                placeholder="https://example.com/image.jpg"
                                value={newPortfolioImageUrl}
                                onChange={(e) => setNewPortfolioImageUrl(e.target.value)}
                              />
                            </div>
                            <Button 
                              onClick={handleAddPortfolioItem}
                              disabled={isSubmittingPortfolio}
                              className="w-full"
                            >
                              {isSubmittingPortfolio ? 'যোগ হচ্ছে...' : 'পোর্টফোলিও যোগ করুন'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      {portfolioLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-48 rounded-lg" />
                          ))}
                        </div>
                      ) : portfolioItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>এখনো কোনো পোর্টফোলিও আইটেম নেই</p>
                          <p className="text-sm">আপনার কাজ প্রদর্শন করতে প্রকল্প যোগ করুন</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {portfolioItems.map((item) => (
                            <div key={item.id} className="group relative rounded-lg overflow-hidden border border-border">
                              <img 
                                src={item.image_url} 
                                alt={item.title}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeletePortfolioItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  মুছুন
                                </Button>
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium">{item.title}</h4>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="certifications">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>সার্টিফিকেশন</CardTitle>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        সার্টিফিকেশন যোগ করুন
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {certifications.map((cert) => (
                          <div key={cert.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div>
                              <h4 className="font-medium">{cert.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {cert.issuer} • {cert.year}
                              </p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-success" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
