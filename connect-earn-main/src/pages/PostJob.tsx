import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { skills } from '@/data/mockData';
import { jobSchema, validateData } from '@/lib/validations';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  FileText,
  CheckCircle,
  Upload,
  X,
  Sparkles
} from 'lucide-react';

type Step = 'title' | 'description' | 'skills' | 'budget' | 'review';

export default function PostJob() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('title');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    skills: [] as string[],
    budgetType: 'fixed',
    budgetMin: '',
    budgetMax: '',
    duration: '',
    experienceLevel: 'intermediate',
    attachments: [] as File[],
  });

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'title', label: 'শিরোনাম', icon: FileText },
    { id: 'description', label: 'বিবরণ', icon: FileText },
    { id: 'skills', label: 'দক্ষতা', icon: Users },
    { id: 'budget', label: 'বাজেট', icon: DollarSign },
    { id: 'review', label: 'পর্যালোচনা', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Header />
      
      <main className="container py-8 max-w-3xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link to="/client-dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            ড্যাশবোর্ডে ফিরুন
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl gradient-hero flex items-center justify-center shadow-glow animate-float">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                নতুন কাজ পোস্ট করুন
              </h1>
              <p className="text-muted-foreground">
                আপনার প্রজেক্টের জন্য সেরা ফ্রিল্যান্সার খুঁজুন
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 animate-slide-up stagger-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              ধাপ {currentStepIndex + 1} / {steps.length}
            </span>
            <span className="text-sm font-medium gradient-text">{Math.round(progress)}% সম্পন্ন</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index <= currentStepIndex && setCurrentStep(step.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  index <= currentStepIndex ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  index < currentStepIndex
                    ? 'gradient-hero text-primary-foreground shadow-glow scale-100'
                    : index === currentStepIndex
                    ? 'bg-primary/20 text-primary border-2 border-primary animate-pulse-soft'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-xs hidden sm:block transition-colors ${
                  index === currentStepIndex ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="glass shadow-floating border-border/50 animate-slide-up stagger-2">
          <CardContent className="p-6 md:p-8">
            {/* Step 1: Title */}
            {currentStep === 'title' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    কাজের শিরোনাম
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    একটি স্পষ্ট শিরোনাম ফ্রিল্যান্সারদের আপনার প্রয়োজন বুঝতে সাহায্য করে
                  </p>
                  <Input
                    id="title"
                    placeholder="যেমন: ই-কমার্স প্রজেক্টের জন্য সিনিয়র React ডেভেলপার"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="h-12 bg-card/50 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-base font-semibold">ক্যাটাগরি</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    আপনার কাজের সাথে সবচেয়ে উপযুক্ত ক্যাটাগরি বেছে নিন
                  </p>
                  <select 
                    className="w-full h-12 rounded-xl border border-border/50 bg-card/50 px-4 focus:border-primary transition-colors"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">একটি ক্যাটাগরি বেছে নিন</option>
                    <option value="web-dev">ওয়েব ডেভেলপমেন্ট</option>
                    <option value="mobile-dev">মোবাইল ডেভেলপমেন্ট</option>
                    <option value="design">ডিজাইন ও ক্রিয়েটিভ</option>
                    <option value="writing">লেখালেখি ও কন্টেন্ট</option>
                    <option value="data-science">ডাটা সায়েন্স ও AI</option>
                    <option value="marketing">মার্কেটিং</option>
                    <option value="cooking">রান্না ও খাবার</option>
                    <option value="cleaning">পরিষ্কার-পরিচ্ছন্নতা</option>
                    <option value="childcare">শিশু যত্ন</option>
                    <option value="tutoring">টিউটরিং ও শিক্ষা</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Description */}
            {currentStep === 'description' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label htmlFor="description" className="text-base font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    কাজের বিবরণ
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    আপনার প্রজেক্টের বিস্তারিত বিবরণ দিন। লক্ষ্য, ডেলিভারেবল এবং প্রয়োজনীয়তা উল্লেখ করুন।
                  </p>
                  <Textarea
                    id="description"
                    placeholder="আমরা একজন অভিজ্ঞ ডেভেলপার খুঁজছি যিনি..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-48 bg-card/50 border-border/50 focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.description.length}/৫০০০ অক্ষর
                  </p>
                </div>
                <div>
                  <Label className="text-base font-semibold">সংযুক্তি (ঐচ্ছিক)</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    ফ্রিল্যান্সারদের আপনার প্রজেক্ট বুঝতে সাহায্য করার জন্য ফাইল যোগ করুন
                  </p>
                  <div className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-primary/50 transition-all hover:bg-primary/5 cursor-pointer group">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3 group-hover:text-primary transition-colors group-hover:scale-110" />
                    <p className="text-sm text-muted-foreground">
                      এখানে ফাইল টেনে আনুন, অথবা ব্রাউজ করতে ক্লিক করুন
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      প্রতি ফাইল সর্বোচ্চ ২৫MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {currentStep === 'skills' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    প্রয়োজনীয় দক্ষতা
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    এই কাজের জন্য প্রয়োজনীয় সর্বোচ্চ ১০টি দক্ষতা নির্বাচন করুন
                  </p>
                  <Input 
                    placeholder="দক্ষতা খুঁজুন..." 
                    className="mb-4 bg-card/50 border-border/50"
                  />
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? 'default' : 'skill'}
                        className={`cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105 ${
                          formData.skills.includes(skill) 
                            ? 'shadow-glow' 
                            : 'hover:bg-primary/10'
                        }`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                        {formData.skills.includes(skill) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {formData.skills.length > 0 && (
                    <p className="text-sm text-primary font-medium mt-3">
                      {formData.skills.length}/১০ দক্ষতা নির্বাচিত
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-base font-semibold">অভিজ্ঞতার স্তর</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    কী স্তরের অভিজ্ঞতা প্রয়োজন?
                  </p>
                  <RadioGroup 
                    value={formData.experienceLevel}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                    className="space-y-3"
                  >
                    <div className={`flex items-center space-x-3 p-4 border rounded-xl hover:border-primary/50 transition-all cursor-pointer ${
                      formData.experienceLevel === 'entry' ? 'border-primary bg-primary/5' : 'border-border/50'
                    }`}>
                      <RadioGroupItem value="entry" id="entry" />
                      <div>
                        <Label htmlFor="entry" className="font-medium cursor-pointer">প্রবেশ স্তর</Label>
                        <p className="text-sm text-muted-foreground">এই ক্ষেত্রে নতুন, মৌলিক বিষয় শিখছেন</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-3 p-4 border rounded-xl hover:border-primary/50 transition-all cursor-pointer ${
                      formData.experienceLevel === 'intermediate' ? 'border-primary bg-primary/5' : 'border-border/50'
                    }`}>
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <div>
                        <Label htmlFor="intermediate" className="font-medium cursor-pointer">মধ্যম স্তর</Label>
                        <p className="text-sm text-muted-foreground">কিছু অভিজ্ঞতা আছে, স্বাধীনভাবে কাজ করতে পারেন</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-3 p-4 border rounded-xl hover:border-primary/50 transition-all cursor-pointer ${
                      formData.experienceLevel === 'expert' ? 'border-primary bg-primary/5' : 'border-border/50'
                    }`}>
                      <RadioGroupItem value="expert" id="expert" />
                      <div>
                        <Label htmlFor="expert" className="font-medium cursor-pointer">বিশেষজ্ঞ</Label>
                        <p className="text-sm text-muted-foreground">অত্যন্ত দক্ষ, শিল্পে অগ্রণী</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 4: Budget */}
            {currentStep === 'budget' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    বাজেটের ধরন
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    এই কাজের জন্য আপনি কীভাবে পেমেন্ট করতে চান?
                  </p>
                  <RadioGroup 
                    value={formData.budgetType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, budgetType: value }))}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className={`relative p-5 border rounded-2xl cursor-pointer transition-all hover-lift ${
                      formData.budgetType === 'fixed' ? 'border-primary bg-primary/5 shadow-glow' : 'hover:border-primary/50 border-border/50'
                    }`}>
                      <RadioGroupItem value="fixed" id="fixed" className="absolute right-4 top-4" />
                      <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center mb-3">
                        <DollarSign className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <Label htmlFor="fixed" className="font-semibold cursor-pointer">স্থির মূল্য</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        পুরো প্রজেক্টের জন্য একটি নির্ধারিত পরিমাণ পেমেন্ট করুন
                      </p>
                    </div>
                    <div className={`relative p-5 border rounded-2xl cursor-pointer transition-all hover-lift ${
                      formData.budgetType === 'hourly' ? 'border-primary bg-primary/5 shadow-glow' : 'hover:border-primary/50 border-border/50'
                    }`}>
                      <RadioGroupItem value="hourly" id="hourly" className="absolute right-4 top-4" />
                      <div className="h-12 w-12 rounded-xl bg-info/20 flex items-center justify-center mb-3">
                        <Clock className="h-6 w-6 text-info" />
                      </div>
                      <Label htmlFor="hourly" className="font-semibold cursor-pointer">ঘণ্টা প্রতি রেট</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        কাজ সম্পন্ন হওয়ার সাথে সাথে ঘণ্টা প্রতি পেমেন্ট করুন
                      </p>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold">
                    {formData.budgetType === 'fixed' ? 'প্রজেক্ট বাজেট' : 'ঘণ্টা প্রতি রেট'}
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    আপনার বাজেট সীমা নির্ধারণ করুন
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min" className="text-sm text-muted-foreground">সর্বনিম্ন</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">৳</span>
                        <Input
                          id="min"
                          type="number"
                          placeholder={formData.budgetType === 'fixed' ? '১০০০' : '৫০০'}
                          value={formData.budgetMin}
                          onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
                          className="pl-8 bg-card/50 border-border/50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="max" className="text-sm text-muted-foreground">সর্বোচ্চ</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">৳</span>
                        <Input
                          id="max"
                          type="number"
                          placeholder={formData.budgetType === 'fixed' ? '৫০০০০' : '২০০০'}
                          value={formData.budgetMax}
                          onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
                          className="pl-8 bg-card/50 border-border/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">প্রজেক্টের সময়কাল</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    এই প্রজেক্ট সম্পন্ন করতে কতক্ষণ সময় লাগবে বলে আপনি মনে করেন?
                  </p>
                  <select 
                    className="w-full h-12 rounded-xl border border-border/50 bg-card/50 px-4"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  >
                    <option value="">সময়কাল নির্বাচন করুন</option>
                    <option value="less-1-week">১ সপ্তাহের কম</option>
                    <option value="1-2-weeks">১-২ সপ্তাহ</option>
                    <option value="2-4-weeks">২-৪ সপ্তাহ</option>
                    <option value="1-3-months">১-৩ মাস</option>
                    <option value="3-6-months">৩-৬ মাস</option>
                    <option value="6-months-plus">৬+ মাস</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 'review' && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center pb-6 border-b border-border/50">
                  <div className="h-16 w-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4 shadow-glow animate-bounce-subtle">
                    <CheckCircle className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    আপনার কাজের পোস্ট পর্যালোচনা করুন
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    পোস্ট করার আগে সবকিছু ঠিক আছে কিনা নিশ্চিত করুন
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-muted/30 rounded-2xl border border-border/50">
                    <h3 className="font-semibold text-lg mb-2">{formData.title || 'কাজের শিরোনাম'}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="capitalize">{formData.category || 'ক্যাটাগরি নির্বাচিত নয়'}</Badge>
                      <Badge variant="secondary">{
                        formData.experienceLevel === 'entry' ? 'প্রবেশ স্তর' :
                        formData.experienceLevel === 'intermediate' ? 'মধ্যম স্তর' : 'বিশেষজ্ঞ'
                      }</Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">বিবরণ</h4>
                    <p className="text-sm bg-card/50 p-4 rounded-xl border border-border/30">
                      {formData.description || 'কোনো বিবরণ দেওয়া হয়নি'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">দক্ষতা</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill) => (
                          <Badge key={skill} variant="skill" className="animate-scale-in">{skill}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">কোনো দক্ষতা নির্বাচিত নয়</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-card/50 rounded-xl border border-border/30">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">বাজেট</h4>
                      <p className="font-semibold text-lg gradient-text">
                        ৳{formData.budgetMin || '০'} - ৳{formData.budgetMax || '০'}
                        {formData.budgetType === 'hourly' && '/ঘণ্টা'}
                      </p>
                    </div>
                    <div className="p-4 bg-card/50 rounded-xl border border-border/30">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">সময়কাল</h4>
                      <p className="font-semibold text-lg">{
                        formData.duration === 'less-1-week' ? '১ সপ্তাহের কম' :
                        formData.duration === '1-2-weeks' ? '১-২ সপ্তাহ' :
                        formData.duration === '2-4-weeks' ? '২-৪ সপ্তাহ' :
                        formData.duration === '1-3-months' ? '১-৩ মাস' :
                        formData.duration === '3-6-months' ? '৩-৬ মাস' :
                        formData.duration === '6-months-plus' ? '৬+ মাস' : 'নির্ধারিত নয়'
                      }</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                পেছনে
              </Button>
              
              {currentStep === 'review' ? (
                <Button 
                  variant="hero" 
                  onClick={async () => {
                    if (!user) {
                      toast({ 
                        title: "লগইন করুন", 
                        description: "কাজ পোস্ট করতে আপনাকে লগইন করতে হবে",
                        variant: "destructive" 
                      });
                      navigate("/auth");
                      return;
                    }

                    // Validate input data with Zod schema
                    const budgetMinNum = parseFloat(formData.budgetMin);
                    const budgetMaxNum = parseFloat(formData.budgetMax);
                    const validation = validateData(jobSchema, {
                      title: formData.title,
                      description: formData.description,
                      category: formData.category,
                      budgetMin: isNaN(budgetMinNum) ? 0 : budgetMinNum,
                      budgetMax: isNaN(budgetMaxNum) ? 0 : budgetMaxNum,
                      skills: formData.skills,
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
                      const { error } = await supabase.from("jobs").insert({
                        client_id: user.id,
                        title: validatedData.title.trim(),
                        description: validatedData.description.trim(),
                        category: validatedData.category,
                        skills: validatedData.skills,
                        budget_type: formData.budgetType,
                        budget_min: validatedData.budgetMin,
                        budget_max: validatedData.budgetMax,
                        duration: formData.duration,
                        experience_level: formData.experienceLevel,
                        status: "open",
                      });

                      if (error) throw error;

                      toast({ 
                        title: "কাজ পোস্ট হয়েছে!", 
                        description: "আপনার কাজ সফলভাবে প্রকাশিত হয়েছে।" 
                      });
                      navigate("/client-dashboard");
                    } catch (error: any) {
                      toast({ 
                        title: "কাজ পোস্ট ব্যর্থ", 
                        description: error.message,
                        variant: "destructive" 
                      });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="min-w-32 hover-shine"
                >
                  {isSubmitting ? "পোস্ট হচ্ছে..." : "কাজ পোস্ট করুন"}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={nextStep} className="group">
                  পরবর্তী
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
