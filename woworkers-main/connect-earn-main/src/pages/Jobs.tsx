import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { categories, skills } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

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
}

import { Search, SlidersHorizontal, X, ChevronDown, Briefcase, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState([0, 200]);
  const [experienceLevel, setExperienceLevel] = useState<string[]>([]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("status", "open")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleExperience = (level: string) => {
    setExperienceLevel(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };

  const toggleJobType = (type: string) => {
    setJobType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setBudgetRange([0, 200]);
    setExperienceLevel([]);
    setJobType([]);
  };

  const hasFilters = selectedSkills.length > 0 || experienceLevel.length > 0 || jobType.length > 0;

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Category */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h4 className="font-display font-semibold text-sm">ক্যাটাগরি</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-3">
            {categories.slice(0, 6).map(category => (
              <label key={category.name} className="flex items-center gap-3 text-sm cursor-pointer hover:text-primary transition-colors group">
                <Checkbox className="rounded-md" />
                <span className="flex-1">{category.name}</span>
                <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded-full">
                  {category.count.toLocaleString('bn-BD')}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Experience Level */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h4 className="font-display font-semibold text-sm">অভিজ্ঞতার স্তর</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-3">
            {[{ label: 'প্রবেশ স্তর', value: 'entry' }, { label: 'মধ্যবর্তী', value: 'intermediate' }, { label: 'বিশেষজ্ঞ', value: 'expert' }].map(level => (
              <label key={level.value} className="flex items-center gap-3 text-sm cursor-pointer hover:text-primary transition-colors">
                <Checkbox className="rounded-md" checked={experienceLevel.includes(level.value)} onCheckedChange={() => toggleExperience(level.value)} />
                <span>{level.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Job Type */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h4 className="font-display font-semibold text-sm">কাজের ধরন</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-3">
            {[{ label: 'ঘণ্টায়', value: 'hourly' }, { label: 'নির্দিষ্ট মূল্য', value: 'fixed' }].map(type => (
              <label key={type.value} className="flex items-center gap-3 text-sm cursor-pointer hover:text-primary transition-colors">
                <Checkbox className="rounded-md" checked={jobType.includes(type.value)} onCheckedChange={() => toggleJobType(type.value)} />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Budget Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h4 className="font-display font-semibold text-sm">ঘণ্টার রেট</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="px-1">
            <Slider value={budgetRange} onValueChange={setBudgetRange} max={200} step={10} className="mb-4" />
            <div className="flex justify-between text-sm">
              <span className="font-medium text-primary">৳{budgetRange[0]}/ঘণ্টা</span>
              <span className="font-medium text-primary">৳{budgetRange[1]}+/ঘণ্টা</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Skills */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h4 className="font-display font-semibold text-sm">দক্ষতা</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 12).map(skill => (
              <Badge 
                key={skill} 
                variant={selectedSkills.includes(skill) ? 'default' : 'skill'} 
                className="cursor-pointer transition-all hover:scale-105" 
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full mt-4">
          সব ফিল্টার মুছুন
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden bg-muted/30">
          <div className="absolute inset-0 gradient-mesh opacity-50" />
          <div className="container py-10 md:py-14 relative shadow-sm">
            <div className="flex items-center gap-3 mb-3 shadow-none">
              <div className="h-12 w-12 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  কাজ খুঁজুন
                </h1>
                <p className="text-muted-foreground">
                  যাচাইকৃত পরিবার এবং ক্লায়েন্টদের থেকে সুযোগ ব্রাউজ করুন
                </p>
              </div>
            </div>

            {/* Search Bar - Glassmorphism */}
            <div className="mt-8 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="শিরোনাম, দক্ষতা, বা কীওয়ার্ড দ্বারা কাজ অনুসন্ধান করুন..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="pl-12 h-14 text-base glass border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20" 
                />
              </div>
              
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden h-14 w-14 rounded-2xl border-border/50">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="font-display">ফিল্টার</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSection />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {hasFilters && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">সক্রিয় ফিল্টার:</span>
                {selectedSkills.map(skill => (
                  <Badge key={skill} variant="secondary" className="gap-1.5 pr-1.5">
                    {skill}
                    <button 
                      className="h-4 w-4 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 flex items-center justify-center transition-colors" 
                      onClick={() => toggleSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {experienceLevel.map(level => (
                  <Badge key={level} variant="secondary" className="gap-1.5 pr-1.5 capitalize">
                    {level === 'entry' ? 'প্রবেশ স্তর' : level === 'intermediate' ? 'মধ্যবর্তী' : 'বিশেষজ্ঞ'}
                    <button 
                      className="h-4 w-4 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 flex items-center justify-center transition-colors" 
                      onClick={() => toggleExperience(level)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-72 shrink-0">
              <Card className="sticky top-24 border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-display">ফিল্টার</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <FilterSection />
                </CardContent>
              </Card>
            </aside>

            {/* Job Listings */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-muted-foreground">
                    <span className="font-display font-bold text-foreground">{jobs.length}</span> কাজ পাওয়া গেছে
                  </p>
                </div>
                <select className="text-sm border border-border/50 rounded-xl px-4 py-2.5 bg-card/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all">
                  <option>সাম্প্রতিক</option>
                  <option>সবচেয়ে প্রাসঙ্গিক</option>
                  <option>সর্বোচ্চ বাজেট</option>
                </select>
              </div>

              {loading ? (
                <div className="space-y-5">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </Card>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <Card className="p-12 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">কোন কাজ পাওয়া যায়নি</h3>
                  <p className="text-muted-foreground">নতুন সুযোগের জন্য পরে দেখুন</p>
                </Card>
              ) : (
                <div className="space-y-5">
                  {jobs.map(job => (
                    <Link key={job.id} to={`/jobs/${job.id}`}>
                      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={job.budget_type === 'hourly' ? 'info' : 'success'}>
                                {job.budget_type === 'hourly' ? 'ঘণ্টায়' : 'নির্দিষ্ট'}
                              </Badge>
                              {job.experience_level && (
                                <Badge variant="outline" className="capitalize">
                                  {job.experience_level === 'entry' ? 'প্রবেশ স্তর' : job.experience_level === 'intermediate' ? 'মধ্যবর্তী' : 'বিশেষজ্ঞ'}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-display font-bold text-lg text-primary">
                              ৳{job.budget_min} - ৳{job.budget_max}
                              {job.budget_type === 'hourly' && <span className="text-sm font-normal">/ঘণ্টা</span>}
                            </p>
                          </div>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(job.skills || []).slice(0, 4).map(skill => (
                            <Badge key={skill} variant="skill">{skill}</Badge>
                          ))}
                          {(job.skills || []).length > 4 && (
                            <Badge variant="outline">+{(job.skills || []).length - 4}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>পোস্ট হয়েছে {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: bn })}</span>
                          {job.duration && <span>• {job.duration}</span>}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {jobs.length > 0 && (
                <div className="mt-10 flex justify-center gap-2">
                  <Button variant="outline" disabled className="rounded-xl">আগের</Button>
                  <Button variant="default" className="rounded-xl">১</Button>
                  <Button variant="outline" className="rounded-xl">পরবর্তী</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
