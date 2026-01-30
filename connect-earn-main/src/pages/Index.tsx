import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { JobCard } from '@/components/jobs/JobCard';
import { FreelancerCard } from '@/components/freelancers/FreelancerCard';
import { AnimatedBackground, FloatingOrbs } from '@/components/ui/animated-background';
import { featuredJobs, topFreelancers, categories } from '@/data/mockData';
import { 
  Search, 
  ArrowRight, 
  Shield, 
  Heart, 
  MapPin, 
  CheckCircle,
  Star,
  Users,
  Briefcase,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  Clock,
  CreditCard,
  MessageSquare,
  Zap,
  Target,
  UserCheck,
  TrendingUp,
  Award
} from 'lucide-react';

export default function Index() {
  const stats = [
    { label: 'যাচাইকৃত কর্মী', value: '৫০K+', icon: Users },
    { label: 'সম্পন্ন কাজ', value: '২০০K+', icon: Briefcase },
    { label: 'সুখী পরিবার', value: '৮০K+', icon: Heart },
    { label: 'শহর কভার', value: '৬৪+', icon: MapPin },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'যাচাইকৃত ও নিরাপদ',
      description: 'আপনার মানসিক শান্তির জন্য সব কর্মী পুঙ্খানুপুঙ্খ আইডি যাচাইকরণ এবং ব্যাকগ্রাউন্ড চেকের মধ্য দিয়ে যায়।',
    },
    {
      icon: BadgeCheck,
      title: 'শুধুমাত্র মহিলা পেশাদার',
      description: 'একচেটিয়াভাবে যাচাইকৃত মহিলা গৃহস্থালি এবং ব্যক্তিগত সেবা প্রদান করে যা আপনি বিশ্বাস করতে পারেন।',
    },
    {
      icon: Shield,
      title: 'নিরাপদ পেমেন্ট',
      description: 'সুরক্ষিত এসক্রো পেমেন্ট নিশ্চিত করে যে আপনি সম্পূর্ণ সন্তুষ্ট হলেই শুধুমাত্র পেমেন্ট করবেন।',
    },
    {
      icon: Sparkles,
      title: 'গুণমান নিশ্চিত',
      description: 'প্রমাণিত ট্র্যাক রেকর্ড এবং দক্ষতা মূল্যায়ন সহ রেটেড পেশাদার।',
    },
  ];

  const howItWorks = [
    {
      step: '০১',
      icon: Search,
      title: 'আপনার মিল খুঁজুন',
      description: 'যাচাইকৃত পেশাদারদের ব্রাউজ করুন অথবা প্রস্তাব পেতে আপনার প্রয়োজনীয়তা পোস্ট করুন।',
    },
    {
      step: '০২',
      icon: MessageSquare,
      title: 'সংযোগ করুন ও আলোচনা করুন',
      description: 'প্রার্থীদের সাথে চ্যাট করুন, তাদের প্রোফাইল পর্যালোচনা করুন এবং আপনার নির্দিষ্ট প্রয়োজনীয়তা নিয়ে আলোচনা করুন।',
    },
    {
      step: '০৩',
      icon: UserCheck,
      title: 'আত্মবিশ্বাসের সাথে নিয়োগ করুন',
      description: 'সেরা ফিট নির্বাচন করুন এবং আমাদের সুরক্ষিত প্ল্যাটফর্মের মাধ্যমে নিরাপদে নিয়োগ করুন।',
    },
    {
      step: '০৪',
      icon: CreditCard,
      title: 'নিরাপদে পেমেন্ট করুন',
      description: 'সম্পন্ন কাজে সন্তুষ্ট হলেই শুধুমাত্র পেমেন্ট রিলিজ করুন।',
    },
  ];

  const trustFeatures = [
    'আইডি ও লিঙ্গ যাচাইকরণ',
    'ব্যাকগ্রাউন্ড চেক উপলব্ধ',
    'নিরাপত্তা রেটিং ও রিভিউ',
    'নিরাপদ ইন-অ্যাপ মেসেজিং',
    'পেমেন্ট সুরক্ষা',
    'বিরোধ নিষ্পত্তি',
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <FloatingOrbs />
          
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="featured" className="mb-8 animate-fade-in gap-2 px-5 py-2.5 text-sm hover-scale cursor-default">
                <Shield className="h-4 w-4 animate-pulse-soft" />
                ৮০,০০০+ পরিবারের বিশ্বাস
                <Sparkles className="h-4 w-4 text-warning" />
              </Badge>
              
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-8 animate-slide-up">
                আপনার ঘরের জন্য{' '}
                <span className="gradient-text animate-gradient bg-gradient-to-r from-primary via-info to-primary bg-[length:200%_auto]">বিশ্বস্ত মহিলা</span>
                <br />
                <span className="relative">
                  পেশাদার নিয়োগ করুন
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="2" fill="none" className="animate-pulse-soft" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up stagger-1">
                রান্না এবং পরিষ্কার থেকে শিশু যত্ন এবং টিউটরিং পর্যন্ত — আপনার সব গৃহস্থালি প্রয়োজনের জন্য যাচাইকৃত, নির্ভরযোগ্য মহিলা পেশাদার খুঁজুন। নিরাপদ, বিশ্বস্ত এবং ক্ষমতায়নকারী।
              </p>

              {/* Search Box - Glassmorphism */}
              <div className="glass rounded-3xl p-4 max-w-2xl mx-auto shadow-floating animate-slide-up stagger-2 hover:shadow-glow transition-shadow duration-500">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="আপনার কি সেবা দরকার? (যেমন, আয়া, রাঁধুনি, পরিচ্ছন্নকারী)" 
                      className="pl-12 h-14 text-base border-0 bg-card/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all"
                    />
                  </div>
                  <Button variant="hero" size="xl" className="sm:w-auto w-full group hover-shine">
                    সেবা খুঁজুন
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Popular Searches */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-fade-in stagger-3">
                <span className="text-sm text-muted-foreground">জনপ্রিয়:</span>
                {['আয়া', 'রাঁধুনি', 'ঘর পরিষ্কার', 'টিউটর', 'মেকআপ আর্টিস্ট', 'বয়স্ক যত্ন'].map((term, i) => (
                  <Badge 
                    key={term} 
                    variant="glass" 
                    className="cursor-pointer hover:bg-card/80 transition-all hover:scale-110 hover:shadow-md animate-scale-in"
                    style={{ animationDelay: `${0.1 * i}s` }}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar - Glassmorphism */}
          <div className="mt-20 border-t border-border/30 glass">
            <div className="container py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.label} 
                    className="text-center group animate-slide-up card-interactive p-4 rounded-2xl"
                    style={{ animationDelay: `${0.15 * index}s` }}
                  >
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-hero text-primary-foreground mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <div className="font-display text-3xl md:text-4xl font-bold text-foreground group-hover:gradient-text transition-all">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-40" />
          <div className="container relative">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="success" className="mb-4 animate-bounce-subtle">
                <Zap className="h-3 w-3 mr-1 animate-pulse-soft" />
                সহজ প্রক্রিয়া
              </Badge>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                কিভাবে কাজ করে
              </h2>
              <p className="text-muted-foreground text-lg">
                আমাদের সহজ, নিরাপদ নিয়োগ প্রক্রিয়ায় মিনিটে শুরু করুন
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <Card 
                  key={item.title} 
                  className="relative overflow-hidden group card-interactive border-border/30 bg-card/60 backdrop-blur-md animate-slide-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="absolute top-0 right-0 font-display text-9xl font-bold text-primary/5 -mr-6 -mt-6 group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </div>
                  {/* Connecting line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-14 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                  <CardContent className="p-8 relative">
                    <div className="h-16 w-16 rounded-2xl gradient-hero text-primary-foreground flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-glow animate-float" style={{ animationDelay: `${0.5 * index}s` }}>
                      <item.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 md:py-32 relative">
          <div className="absolute inset-0 bg-muted/20" />
          <div className="container relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div className="animate-slide-up">
                <Badge variant="featured" className="mb-4">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  সেবা ব্রাউজ করুন
                </Badge>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">
                  প্রতিটি প্রয়োজনে সাহায্য খুঁজুন
                </h2>
                <p className="text-muted-foreground text-lg">
                  মহিলা নেতৃত্বাধীন সেবার আমাদের কিউরেটেড ক্যাটাগরি এক্সপ্লোর করুন
                </p>
              </div>
              <Link to="/categories" className="hidden md:flex">
                <Button variant="outline" size="lg" className="group hover-glow">
                  সব ক্যাটাগরি
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.slice(0, 8).map((category, index) => (
                <Link 
                  key={category.name} 
                  to={`/jobs?category=${encodeURIComponent(category.name)}`}
                  className="animate-scale-in"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <Card className="group card-interactive cursor-pointer h-full border-border/30 bg-card/70 backdrop-blur-md hover:border-primary/40 hover:shadow-glow">
                    <CardContent className="p-6">
                      <span className="text-5xl mb-4 block group-hover:scale-125 group-hover:-rotate-6 transition-all duration-300">{category.icon}</span>
                      <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-primary font-bold">
                          {category.count.toLocaleString('bn-BD')}
                        </span>
                        <span className="text-xs text-muted-foreground">পেশাদার</span>
                        <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <Link to="/categories" className="md:hidden mt-8 block">
              <Button variant="outline" className="w-full group" size="lg">
                সব ক্যাটাগরি
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh" />
          <div className="container relative">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="featured" className="mb-4">
                <Shield className="h-3 w-3 mr-1" />
                বিশ্বাস ও নিরাপত্তা
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                আপনার নিরাপত্তা আমাদের অগ্রাধিকার
              </h2>
              <p className="text-muted-foreground text-lg">
                ক্লায়েন্ট এবং কর্মী উভয়ের জন্য একটি নিরাপদ এবং বিশ্বস্ত প্ল্যাটফর্ম নিশ্চিত করতে আমরা ব্যাপক পদক্ষেপ নিই।
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {trustFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-4 p-5 glass rounded-2xl hover-lift">
                  <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center shrink-0 shadow-glow">
                    <CheckCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={feature.title} className="text-center group hover-lift border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardContent className="pt-10 pb-8 px-6">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-hero text-primary-foreground mb-6 group-hover:scale-110 transition-transform shadow-glow">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <Badge variant="success" className="mb-4">
                  <Clock className="h-3 w-3 mr-1" />
                  নতুন সুযোগ
                </Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  সাম্প্রতিক কাজের পোস্টিং
                </h2>
                <p className="text-muted-foreground text-lg">
                  যাচাইকৃত পরিবার এবং ক্লায়েন্টদের থেকে নতুন সুযোগ
                </p>
              </div>
              <Link to="/jobs" className="hidden md:flex">
                <Button variant="outline" size="lg">
                  সব কাজ দেখুন
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {featuredJobs.slice(0, 4).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            <Link to="/jobs" className="md:hidden mt-8 block">
              <Button variant="outline" className="w-full" size="lg">
                সব কাজ দেখুন
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Top Woworkers Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-50" />
          <div className="container relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <Badge variant="featured" className="mb-4">
                  <Star className="h-3 w-3 mr-1" />
                  শীর্ষ রেটেড
                </Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  বৈশিষ্ট্যযুক্ত কর্মী
                </h2>
                <p className="text-muted-foreground text-lg">
                  আমাদের সর্বোচ্চ রেটেড যাচাইকৃত মহিলা পেশাদারদের সাথে দেখা করুন
                </p>
              </div>
              <Link to="/freelancers" className="hidden md:flex">
                <Button variant="outline" size="lg">
                  সব কর্মী দেখুন
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {topFreelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
              ))}
            </div>

            <Link to="/freelancers" className="md:hidden mt-8 block">
              <Button variant="outline" className="w-full" size="lg">
                সব কর্মী দেখুন
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-36 gradient-hero text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(0_0%_100%/0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(0_0%_100%/0.08)_0%,transparent_50%)]" />
          <div className="container text-center relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              শুরু করতে প্রস্তুত?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
              আজই হাজার হাজার পেশাদার এবং পরিবারের সাথে যোগ দিন এবং আপনার জীবনকে সহজ করুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/post-job">
                <Button size="xl" variant="secondary" className="w-full sm:w-auto shadow-floating">
                  <Briefcase className="h-5 w-5" />
                  বিনামূল্যে কাজ পোস্ট করুন
                </Button>
              </Link>
              <Link to="/jobs">
                <Button size="xl" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Target className="h-5 w-5" />
                  কাজ খুঁজুন
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
