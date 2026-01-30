import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FreelancerCard } from '@/components/freelancers/FreelancerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { topFreelancers, skills } from '@/data/mockData';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function Freelancers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [rateRange, setRateRange] = useState([0, 200]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setRateRange([0, 200]);
  };

  const hasFilters = selectedSkills.length > 0;

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Category */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-semibold text-sm">ক্যাটাগরি</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-2">
            {['শিশু যত্ন', 'রান্না', 'পরিষ্কার', 'বয়স্ক যত্ন', 'টিউটরিং', 'মেকআপ'].map((category) => (
              <label 
                key={category}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
              >
                <Checkbox />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Hourly Rate */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-semibold text-sm">ঘণ্টার রেট</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="px-2">
            <Slider
              value={rateRange}
              onValueChange={setRateRange}
              max={200}
              step={10}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>৳{rateRange[0]}/ঘণ্টা</span>
              <span>৳{rateRange[1]}+/ঘণ্টা</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Job Success */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-semibold text-sm">সাফল্যের হার</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-2">
            {[{ label: '৯০% ও উপরে', value: '90' }, { label: '৮০% ও উপরে', value: '80' }, { label: '৭০% ও উপরে', value: '70' }, { label: 'যেকোনো', value: 'any' }].map((level) => (
              <label 
                key={level.value}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
              >
                <Checkbox />
                <span>{level.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Availability */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-semibold text-sm">উপলব্ধতা</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-2">
            {[{ label: 'এখনই উপলব্ধ', value: 'now' }, { label: '২ সপ্তাহের মধ্যে', value: '2weeks' }, { label: 'যেকোনো', value: 'any' }].map((availability) => (
              <label 
                key={availability.value}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
              >
                <Checkbox />
                <span>{availability.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Skills */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-semibold text-sm">দক্ষতা</h4>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 12).map((skill) => (
              <Badge 
                key={skill}
                variant={selectedSkills.includes(skill) ? 'default' : 'skill'}
                className="cursor-pointer transition-colors"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          সব ফিল্টার মুছুন
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container py-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              কর্মী খুঁজুন
            </h1>
            <p className="text-muted-foreground">
              আপনার প্রয়োজনে যাচাইকৃত মহিলা পেশাদার ব্রাউজ করুন
            </p>

            {/* Search Bar */}
            <div className="mt-6 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="দক্ষতা, শিরোনাম বা কীওয়ার্ড দ্বারা কর্মী অনুসন্ধান করুন..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
              
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden h-12 w-12">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>ফিল্টার</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSection />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {hasFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">সক্রিয় ফিল্টার:</span>
                {selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleSkill(skill)}
                    />
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
            <aside className="hidden lg:block w-64 shrink-0">
              <Card className="sticky top-24">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">ফিল্টার</CardTitle>
                </CardHeader>
                <CardContent>
                  <FilterSection />
                </CardContent>
              </Card>
            </aside>

            {/* Freelancer Listings */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{topFreelancers.length}</span> কর্মী পাওয়া গেছে
                </p>
                <select className="text-sm border rounded-lg px-3 py-2 bg-background">
                  <option>সেরা মিল</option>
                  <option>সর্বোচ্চ রেটেড</option>
                  <option>সর্বোচ্চ আয়</option>
                  <option>সর্বনিম্ন রেট</option>
                </select>
              </div>

              <div className="space-y-4">
                {topFreelancers.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                ))}
                {/* Duplicate for more content */}
                {topFreelancers.map((freelancer) => (
                  <FreelancerCard key={`${freelancer.id}-2`} freelancer={freelancer} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center gap-2">
                <Button variant="outline" disabled>পূর্ববর্তী</Button>
                <Button variant="default">১</Button>
                <Button variant="outline">২</Button>
                <Button variant="outline">৩</Button>
                <Button variant="outline">পরবর্তী</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
