import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function Signup() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') as 'client' | 'freelancer' | null;
  
  const [step, setStep] = useState<'role' | 'details'>(initialRole ? 'details' : 'role');
  const [role, setRole] = useState<'client' | 'freelancer' | null>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const handleRoleSelect = (selectedRole: 'client' | 'freelancer') => {
    setRole(selectedRole);
    setStep('details');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Wo<span className="text-primary">workers</span>
            </span>
          </Link>

          {step === 'role' ? (
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle className="font-display text-2xl">Join as a client or Woworker</CardTitle>
                <CardDescription>
                  Choose how you want to use Woworkers
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                {/* Client Option */}
                <button
                  onClick={() => handleRoleSelect('client')}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50 ${
                    role === 'client' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">I'm a client, hiring for a project</h3>
                      <p className="text-sm text-muted-foreground">
                        Post jobs and hire talented freelancers
                      </p>
                    </div>
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                      role === 'client' ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`}>
                      {role === 'client' && <CheckCircle className="h-4 w-4 text-primary-foreground" />}
                    </div>
                  </div>
                </button>

                {/* Woworker Option */}
                <button
                  onClick={() => handleRoleSelect('freelancer')}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50 ${
                    role === 'freelancer' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">I'm a woman, looking for work</h3>
                      <p className="text-sm text-muted-foreground">
                        Offer your services and earn on your terms
                      </p>
                    </div>
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                      role === 'freelancer' ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`}>
                      {role === 'freelancer' && <CheckCircle className="h-4 w-4 text-primary-foreground" />}
                    </div>
                  </div>
                </button>

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full mt-4"
                  disabled={!role}
                  onClick={() => role && setStep('details')}
                >
                  {role ? `Join as a ${role === 'client' ? 'Client' : 'Freelancer'}` : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-sm text-muted-foreground pt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Log in
                  </Link>
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <div className="flex items-center gap-2 mb-2">
                  <button 
                    onClick={() => setStep('role')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back
                  </button>
                </div>
                <CardTitle className="font-display text-2xl">
                  Sign up to {role === 'client' ? 'hire talent' : 'find work'}
                </CardTitle>
                <CardDescription>
                  Create your free account
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-12">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                    </svg>
                    Apple
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Email Form */}
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="pl-10 h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password (8+ characters)"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </Label>
                  </div>

                  <Button variant="hero" size="lg" className="w-full">
                    Create Account
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Log in
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Right Panel - Image/Branding */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            {role === 'client' 
              ? 'Find the perfect talent for any job'
              : 'Get hired for top opportunities'
            }
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {role === 'client'
              ? 'Access millions of skilled freelancers ready to bring your vision to life.'
              : 'Connect with clients worldwide and build a career on your own terms.'
            }
          </p>
          
          <div className="space-y-4 text-left">
            {(role === 'client' ? [
              'Post jobs and get proposals in minutes',
              'Access verified talent with proven track records',
              'Secure payment protection for every project',
              'Dedicated support when you need it',
            ] : [
              'Find jobs that match your skills',
              'Set your own rates and schedule',
              'Get paid securely for your work',
              'Build your portfolio and reputation',
            ]).map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
