import { Link } from 'react-router-dom';
import { Heart, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const footerLinks = {
    'ক্লায়েন্টদের জন্য': [
      { label: 'কিভাবে কাজ করে', href: '/how-it-works' },
      { label: 'সেবা দেখুন', href: '/jobs' },
      { label: 'নিরাপত্তা নির্দেশিকা', href: '/safety' },
      { label: 'কাজ পোস্ট করুন', href: '/post-job' },
    ],
    'কর্মীদের জন্য': [
      { label: 'কিভাবে শুরু করবেন', href: '/get-started' },
      { label: 'কাজ খুঁজুন', href: '/jobs' },
      { label: 'সাফল্যের টিপস', href: '/success-tips' },
      { label: 'কমিউনিটি', href: '/community' },
    ],
    'বিশ্বাস ও নিরাপত্তা': [
      { label: 'নিরাপত্তা কেন্দ্র', href: '/safety-center' },
      { label: 'যাচাইকরণ', href: '/verification' },
      { label: 'সমস্যা রিপোর্ট করুন', href: '/report' },
      { label: 'বীমা', href: '/insurance' },
    ],
    'কোম্পানি': [
      { label: 'আমাদের সম্পর্কে', href: '/about' },
      { label: 'আমাদের মিশন', href: '/mission' },
      { label: 'ক্যারিয়ার', href: '/careers' },
      { label: 'যোগাযোগ', href: '/contact' },
    ],
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Empowerment Banner */}
      <div className="gradient-hero">
        <div className="container py-10 text-center">
          <h3 className="font-display text-2xl font-bold text-primary-foreground mb-2">
            নারী ক্ষমতায়ন, প্রতিটি কাজে
          </h3>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            হাজার হাজার নারী ওওয়ার্কার্স-এর মাধ্যমে নমনীয় ক্যারিয়ার এবং আর্থিক স্বাধীনতা তৈরি করছে।
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold mb-2">
                সংযুক্ত থাকুন
              </h3>
              <p className="text-background/70 text-sm">
                টিপস, সুযোগ এবং কমিউনিটি আপডেট পান।
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Input 
                placeholder="আপনার ইমেইল দিন" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 w-full md:w-72"
              />
              <Button variant="hero">সাবস্ক্রাইব</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero">
                <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                ওওয়ার্কার্স
              </span>
            </Link>
            <p className="text-background/60 text-sm mb-6">
              পরিবার এবং ব্যবসার সাথে যাচাইকৃত মহিলা পেশাদারদের সংযোগকারী একটি বিশ্বস্ত মার্কেটপ্লেস।
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover:bg-background/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-background/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-background/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-background/10">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-background/90">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-sm text-background/60 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © ২০২৫ ওওয়ার্কার্স। সর্বত্র নারী ক্ষমতায়ন।
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-background/50 hover:text-background transition-colors">
              গোপনীয়তা নীতি
            </Link>
            <Link to="/terms" className="text-sm text-background/50 hover:text-background transition-colors">
              সেবার শর্তাবলী
            </Link>
            <Link to="/cookies" className="text-sm text-background/50 hover:text-background transition-colors">
              কুকি সেটিংস
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
