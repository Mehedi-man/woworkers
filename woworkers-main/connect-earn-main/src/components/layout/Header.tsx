import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  Menu, 
  X,
  Heart,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Shield
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const isLoggedIn = !!user;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero shadow-glow">
            <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            ও<span className="text-primary">ওয়ার্কার্স</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/jobs">
            <Button 
              variant={isActive('/jobs') ? 'secondary' : 'ghost'} 
              size="sm"
            >
              সেবা খুঁজুন
            </Button>
          </Link>
          <Link to="/freelancers">
            <Button 
              variant={isActive('/freelancers') ? 'secondary' : 'ghost'} 
              size="sm"
            >
              কর্মী খুঁজুন
            </Button>
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/dashboard">
                <Button 
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'} 
                  size="sm"
                >
                  ড্যাশবোর্ড
                </Button>
              </Link>
              <Link to="/messages">
                <Button 
                  variant={isActive('/messages') ? 'secondary' : 'ghost'} 
                  size="sm"
                >
                  বার্তা
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Search Bar (Desktop) */}
        {isLoggedIn && (
          <div className="hidden lg:flex relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="সেবা অনুসন্ধান করুন..." 
              className="pl-10 h-9 bg-secondary border-0"
            />
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <ThemeToggle />
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>

              {/* Messages */}
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2 pr-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {user?.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      আমার প্রোফাইল
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      সেটিংস
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    সাইন আউট
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/auth" className="hidden sm:block">
                <Button variant="ghost" size="sm">লগইন</Button>
              </Link>
              <Link to="/auth">
                <Button variant="hero" size="sm" className="gap-2">
                  <Shield className="h-4 w-4" />
                  যোগ দিন
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-down">
          <nav className="container py-4 flex flex-col gap-2">
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                সেবা খুঁজুন
              </Button>
            </Link>
            <Link to="/freelancers" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                কর্মী খুঁজুন
              </Button>
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    ড্যাশবোর্ড
                  </Button>
                </Link>
                <Link to="/messages" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    বার্তা
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  সাইন আউট
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  লগইন
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
