import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Shield, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-16 gradient-subtle">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">ওওয়ার্কার্স সম্পর্কে</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">কাজের মাধ্যমে নারী ক্ষমতায়ন, প্রতিটি সেবায়</p>
        </div>
      </section>
      <main className="container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-lg text-muted-foreground">ওওয়ার্কার্স হল একটি প্ল্যাটফর্ম যা বিশ্বস্ত গৃহস্থালি এবং ব্যক্তিগত সেবার প্রয়োজন এমন ক্লায়েন্টদের সাথে যাচাইকৃত মহিলা পেশাদারদের সংযুক্ত করতে নিবেদিত।</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Heart, title: 'আমাদের মিশন', desc: 'নারীদের তাদের দক্ষতা ও সেবা প্রদানের জন্য একটি নিরাপদ প্ল্যাটফর্ম প্রদান করে ক্ষমতায়িত করা।' },
              { icon: Shield, title: 'বিশ্বাস ও নিরাপত্তা', desc: 'সব কর্মী আইডি চেক এবং ব্যাকগ্রাউন্ড স্ক্রিনিংয়ের মাধ্যমে যাচাই করা হয়।' },
              { icon: Users, title: 'কমিউনিটি', desc: 'হাজার হাজার মহিলা পেশাদার তাদের ক্যারিয়ার গড়ছেন এই কমিউনিটিতে।' },
              { icon: Award, title: 'গুণমান', desc: 'আমরা রিভিউ এবং রেটিংয়ের মাধ্যমে উচ্চ মান বজায় রাখি।' },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <item.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
