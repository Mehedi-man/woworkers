import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-16 gradient-subtle">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">যোগাযোগ করুন</h1>
          <p className="text-lg text-muted-foreground">আমরা আপনার কথা শুনতে চাই</p>
        </div>
      </section>
      <main className="container py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader><CardTitle>বার্তা পাঠান</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>নাম</Label><Input placeholder="আপনার নাম" /></div>
              <div className="space-y-2"><Label>ইমেইল</Label><Input type="email" placeholder="আপনার@ইমেইল.com" /></div>
              <div className="space-y-2"><Label>বার্তা</Label><textarea className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm" placeholder="আপনার বার্তা..." /></div>
              <Button variant="hero" className="w-full">বার্তা পাঠান</Button>
            </CardContent>
          </Card>
          <div className="space-y-6">
            {[
              { icon: Mail, title: 'ইমেইল', info: 'support@woworkers.com' },
              { icon: Phone, title: 'ফোন', info: '+৮৮০ ১৭০০ ০০০০০০' },
              { icon: MapPin, title: 'ঠিকানা', info: 'ঢাকা, বাংলাদেশ' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div><p className="font-semibold">{item.title}</p><p className="text-muted-foreground">{item.info}</p></div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
