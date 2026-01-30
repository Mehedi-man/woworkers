import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Briefcase, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা দিন');
const passwordSchema = z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupStep, setSignupStep] = useState<'role' | 'details'>('role');
  const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer' | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'যাচাইকরণ ত্রুটি',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      toast({
        title: 'লগইন ব্যর্থ',
        description: error.message === 'Invalid login credentials' 
          ? 'ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'স্বাগতম!',
        description: 'আপনি সফলভাবে লগইন করেছেন।',
      });
      navigate('/dashboard');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: 'ভূমিকা প্রয়োজন',
        description: 'অনুগ্রহ করে প্রথমে একটি ভূমিকা নির্বাচন করুন।',
        variant: 'destructive',
      });
      return;
    }

    try {
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'যাচাইকরণ ত্রুটি',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: 'যাচাইকরণ ত্রুটি',
        description: 'অনুগ্রহ করে আপনার নাম দিন।',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, firstName, lastName, selectedRole);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          title: 'অ্যাকাউন্ট আছে',
          description: 'এই ইমেইলে ইতিমধ্যে একটি অ্যাকাউন্ট আছে। অনুগ্রহ করে লগইন করুন।',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'সাইন আপ ব্যর্থ',
          description: error.message,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'অ্যাকাউন্ট তৈরি হয়েছে!',
        description: 'ওওয়ার্কে স্বাগতম! আপনি এখন আপনার ড্যাশবোর্ড অ্যাক্সেস করতে পারেন।',
      });
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            হোমে ফিরে যান
          </Button>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">লগইন</TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setSignupStep('role')}>সাইন আপ</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">স্বাগতম</CardTitle>
                  <CardDescription>
                    আপনার অ্যাকাউন্ট অ্যাক্সেস করতে আপনার তথ্য দিন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">ইমেইল</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">পাসওয়ার্ড</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'সাইন ইন হচ্ছে...' : 'সাইন ইন'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {signupStep === 'role' ? 'ওওয়ার্কে যোগ দিন' : 'অ্যাকাউন্ট তৈরি করুন'}
                  </CardTitle>
                  <CardDescription>
                    {signupStep === 'role' 
                      ? 'আপনি কিভাবে প্ল্যাটফর্ম ব্যবহার করতে চান তা চয়ন করুন'
                      : 'শুরু করতে আপনার বিবরণ দিন'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {signupStep === 'role' ? (
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('client');
                          setSignupStep('details');
                        }}
                        className="w-full p-6 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20">
                            <Briefcase className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">আমি একজন ক্লায়েন্ট</h3>
                            <p className="text-sm text-muted-foreground">
                              আমি প্রতিভাবান কর্মী নিয়োগ করতে চাই
                            </p>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('freelancer');
                          setSignupStep('details');
                        }}
                        className="w-full p-6 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">আমি একজন কর্মী</h3>
                            <p className="text-sm text-muted-foreground">
                              আমি কাজ খুঁজতে এবং আমার ক্যারিয়ার বাড়াতে চাই
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSignupStep('role')}
                        className="mb-2"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ভূমিকা পরিবর্তন করুন
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">প্রথম নাম</Label>
                          <Input
                            id="firstName"
                            placeholder="আপনার নাম"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">শেষ নাম</Label>
                          <Input
                            id="lastName"
                            placeholder="আপনার পদবী"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">ইমেইল</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          কমপক্ষে ৬ অক্ষর হতে হবে
                        </p>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 bg-primary p-12 items-center justify-center">
        <div className="max-w-md text-primary-foreground">
          <h1 className="text-4xl font-bold mb-6">
            বিশ্বব্যাপী শীর্ষ প্রতিভার সাথে সংযোগ করুন
          </h1>
          <p className="text-lg opacity-90 mb-8">
            হাজার হাজার পেশাদার যারা সুযোগ খুঁজতে এবং সেরা প্রতিভা নিয়োগ করতে ওওয়ার্ক বিশ্বাস করে তাদের সাথে যোগ দিন।
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-lg font-bold">১০L+</span>
              </div>
              <span className="opacity-90">সক্রিয় কর্মী</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-lg font-bold">৫০K</span>
              </div>
              <span className="opacity-90">মাসিক পোস্ট করা কাজ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-lg font-bold">২০Cr</span>
              </div>
              <span className="opacity-90">মোট পেআউট</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
