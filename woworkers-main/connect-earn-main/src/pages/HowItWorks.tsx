import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Search, FileText, Handshake, Shield, Star } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    { icon: UserPlus, title: 'আপনার অ্যাকাউন্ট তৈরি করুন', description: 'ক্লায়েন্ট বা কর্মী হিসাবে সাইন আপ করুন। কর্মীরা আমাদের যাচাইকরণ প্রক্রিয়ার মধ্য দিয়ে যায়।' },
    { icon: Search, title: 'কাজ খুঁজুন বা পোস্ট করুন', description: 'ক্লায়েন্টরা কাজ পোস্ট করে, কর্মীরা তাদের দক্ষতার সাথে মেলে এমন সুযোগে আবেদন করে।' },
    { icon: FileText, title: 'প্রস্তাব জমা দিন', description: 'কর্মীরা বিস্তারিত প্রস্তাব জমা দেয়। ক্লায়েন্টরা পর্যালোচনা করে এবং প্রার্থীদের শর্টলিস্ট করে।' },
    { icon: Handshake, title: 'নিয়োগ করুন ও কাজ করুন', description: 'নিয়োগের পরে, আমাদের প্ল্যাটফর্মের মাধ্যমে যোগাযোগ করুন এবং কাজ সম্পন্ন করুন।' },
    { icon: Shield, title: 'নিরাপদ পেমেন্ট', description: 'পেমেন্ট এসক্রোতে রাখা হয় এবং কাজ সম্পন্ন হলে রিলিজ করা হয়।' },
    { icon: Star, title: 'রিভিউ দিন', description: 'রিভিউ এবং রেটিংয়ের মাধ্যমে আপনার সুনাম তৈরি করুন।' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-16 gradient-subtle">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">ওওয়ার্কার্স কিভাবে কাজ করে</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">সহজ, নিরাপদ এবং সবার জন্য ক্ষমতায়নকারী</p>
        </div>
      </section>
      <main className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/signup"><Button variant="hero" size="lg">শুরু করুন</Button></Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
