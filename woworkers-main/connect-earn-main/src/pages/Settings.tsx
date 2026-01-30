import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  LogOut,
  Trash2,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { profile, updateProfile, isUpdating } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      updateProfile({
        first_name: firstName,
        last_name: lastName,
      });
      toast({
        title: 'সফল',
        description: 'আপনার প্রোফাইল আপডেট হয়েছে।',
      });
    } catch (error) {
      toast({
        title: 'ত্রুটি',
        description: 'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">সেটিংস</h1>
          <p className="text-muted-foreground mb-8">আপনার অ্যাকাউন্ট পছন্দ ও সেটিংস পরিচালনা করুন</p>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent p-0">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="h-4 w-4 mr-2" />
                প্রোফাইল
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Bell className="h-4 w-4 mr-2" />
                নোটিফিকেশন
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Shield className="h-4 w-4 mr-2" />
                নিরাপত্তা
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CreditCard className="h-4 w-4 mr-2" />
                বিলিং
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Palette className="h-4 w-4 mr-2" />
                অ্যাপিয়ারেন্স
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>প্রোফাইল তথ্য</CardTitle>
                  <CardDescription>আপনার ব্যক্তিগত তথ্য আপডেট করুন</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                      alt="প্রোফাইল"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <Button variant="outline" size="sm">ছবি পরিবর্তন করুন</Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG। সর্বোচ্চ ২MB</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">প্রথম নাম</Label>
                      <Input 
                        id="firstName" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">শেষ নাম</Label>
                      <Input 
                        id="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">ইমেইল</Label>
                      <Input id="email" type="email" value={user?.email || ''} disabled />
                    </div>
                  </div>
                  
                  <Button 
                    variant="hero"
                    onClick={handleSaveProfile}
                    disabled={isSaving || isUpdating}
                  >
                    {isSaving || isUpdating ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>নোটিফিকেশন পছন্দ</CardTitle>
                  <CardDescription>কোন নোটিফিকেশন পাবেন তা নির্বাচন করুন</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">ইমেইল নোটিফিকেশন</p>
                        <p className="text-sm text-muted-foreground">আপনার কার্যকলাপ সম্পর্কে ইমেইল পান</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">নতুন বার্তা</p>
                        <p className="text-sm text-muted-foreground">বার্তা পেলে নোটিফিকেশন পান</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">প্রস্তাব আপডেট</p>
                        <p className="text-sm text-muted-foreground">আপনার জমা দেওয়া প্রস্তাবের আপডেট</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">প্রচারমূলক ইমেইল</p>
                        <p className="text-sm text-muted-foreground">প্রচারমূলক কন্টেন্ট পান</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>নিরাপত্তা সেটিংস</CardTitle>
                  <CardDescription>আপনার পাসওয়ার্ড ও নিরাপত্তা অপশন পরিচালনা করুন</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">বর্তমান পাসওয়ার্ড</Label>
                      <div className="relative">
                        <Input 
                          id="currentPassword" 
                          type={showPassword ? 'text' : 'password'}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">নতুন পাসওয়ার্ড</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button variant="hero">পাসওয়ার্ড আপডেট করুন</Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">দ্বি-স্তরীয় প্রমাণীকরণ</h3>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                      <div>
                        <p className="font-medium">আপনার অ্যাকাউন্ট সুরক্ষিত করুন</p>
                        <p className="text-sm text-muted-foreground">অতিরিক্ত নিরাপত্তা স্তর যোগ করুন</p>
                      </div>
                      <Button variant="outline">২এফএ সক্রিয় করুন</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>বিলিং ও পেমেন্ট</CardTitle>
                  <CardDescription>আপনার পেমেন্ট পদ্ধতি ও বিলিং পরিচালনা করুন</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-16 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                          ভিসা
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• ৪২৪২</p>
                          <p className="text-sm text-muted-foreground">মেয়াদ শেষ ১২/২৫</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">সম্পাদনা</Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    পেমেন্ট পদ্ধতি যোগ করুন
                  </Button>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">বিলিং ইতিহাস</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div>
                          <p className="font-medium">প্রো প্ল্যান - ডিসেম্বর ২০২৪</p>
                          <p className="text-sm text-muted-foreground">১ ডিসে, ২০২৪</p>
                        </div>
                        <p className="font-medium">৳২৯০০</p>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div>
                          <p className="font-medium">প্রো প্ল্যান - নভেম্বর ২০২৪</p>
                          <p className="text-sm text-muted-foreground">১ নভে, ২০২৪</p>
                        </div>
                        <p className="font-medium">৳২৯০০</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>অ্যাপিয়ারেন্স</CardTitle>
                  <CardDescription>ওওয়ার্কার্স আপনার জন্য কিভাবে দেখাবে তা কাস্টমাইজ করুন</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">থিম</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="w-full aspect-video rounded bg-white border border-border mb-2" />
                        <p className="text-sm font-medium">লাইট</p>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="w-full aspect-video rounded bg-zinc-900 border border-zinc-700 mb-2" />
                        <p className="text-sm font-medium">ডার্ক</p>
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          theme === 'system' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="w-full aspect-video rounded bg-gradient-to-r from-white to-zinc-900 mb-2" />
                        <p className="text-sm font-medium">সিস্টেম</p>
                      </button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">মোশন কমান</p>
                      <p className="text-sm text-muted-foreground">অ্যানিমেশন কমান</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <Card className="mt-8 border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">বিপদ অঞ্চল</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">সাইন আউট</p>
                  <p className="text-sm text-muted-foreground">আপনার অ্যাকাউন্ট থেকে সাইন আউট করুন</p>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  সাইন আউট
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">অ্যাকাউন্ট মুছুন</p>
                  <p className="text-sm text-muted-foreground">স্থায়ীভাবে আপনার অ্যাকাউন্ট মুছুন</p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  মুছুন
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
