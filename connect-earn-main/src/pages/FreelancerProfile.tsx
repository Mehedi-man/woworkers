import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { topFreelancers } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { FreelancerReviews } from '@/components/reviews/FreelancerReviews';
import {
  Star,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  Heart,
  Share2,
  MessageSquare,
  Calendar,
  Award,
  Briefcase,
  DollarSign,
  ThumbsUp
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  amount: number;
  created_at: string;
}

export default function FreelancerProfile() {
  const { id } = useParams();
  const freelancer = topFreelancers.find(f => f.id === id) || topFreelancers[0];
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, rating, comment, amount, created_at')
          .eq('freelancer_id', id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setReviews(data || []);
        if (data && data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const portfolio = [
    { id: '1', title: 'Home Organization Project', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'Organization' },
    { id: '2', title: 'Event Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400', category: 'Events' },
    { id: '3', title: 'Meal Prep Service', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', category: 'Cooking' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative">
                    <img
                      src={freelancer.avatar}
                      alt={freelancer.name}
                      className="w-32 h-32 rounded-2xl object-cover"
                    />
                    {freelancer.isVerified && (
                      <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                          {freelancer.name}
                          {freelancer.isVerified && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </h1>
                        <p className="text-lg text-muted-foreground">{freelancer.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Heart className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {freelancer.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-warning fill-warning" />
                        {reviews.length > 0 ? `${averageRating} (${reviews.length} রিভিউ)` : 'কোনো রিভিউ নেই'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Member since 2023
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {freelancer.skills.map((skill) => (
                        <Badge key={skill} variant="skill">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="about">পরিচিতি</TabsTrigger>
                <TabsTrigger value="portfolio">পোর্টফোলিও</TabsTrigger>
                <TabsTrigger value="reviews">রিভিউ ({reviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">About Me</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Hello! I'm {freelancer.name}, a dedicated professional with a passion for providing exceptional 
                      {freelancer.skills[0]?.toLowerCase()} services. With years of experience in the field, I take pride 
                      in delivering high-quality work that exceeds expectations. I believe in building lasting relationships 
                      with my clients through trust, reliability, and outstanding service.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Briefcase className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="font-semibold">{freelancer.completedJobs}+</p>
                        <p className="text-sm text-muted-foreground">Jobs Completed</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <ThumbsUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="font-semibold">{freelancer.successRate}%</p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="font-semibold">Top Rated</p>
                        <p className="text-sm text-muted-foreground">Badge Earned</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="portfolio" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                {id && <FreelancerReviews freelancerId={id} />}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-display font-bold text-foreground">
                    ${freelancer.hourlyRate}
                    <span className="text-lg font-normal text-muted-foreground">/hr</span>
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button variant="hero" className="w-full" size="lg">
                    <MessageSquare className="h-4 w-4" />
                    Contact {freelancer.name.split(' ')[0]}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Calendar className="h-4 w-4" />
                    Book a Service
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Verified Woworker</p>
                      <p className="text-xs text-muted-foreground">ID & Background Checked</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-sm">Available Now</p>
                      <p className="text-xs text-muted-foreground">Usually responds in 1 hour</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Safety Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Identity Verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Background Check Passed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>References Verified</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
