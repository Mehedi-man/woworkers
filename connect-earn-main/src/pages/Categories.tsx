import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/data/mockData';
import { ArrowRight } from 'lucide-react';

export default function Categories() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 gradient-subtle">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            ক্যাটাগরি অনুযায়ী ব্রাউজ করুন
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            আপনার সব গৃহস্থালি এবং ব্যক্তিগত সেবার প্রয়োজনে আপনার এলাকায় যাচাইকৃত কর্মী খুঁজুন
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const slug = category.name.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
            return (
              <Link key={index} to={`/jobs?category=${slug}`}>
                <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors text-2xl">
                      {category.icon}
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        {category.count.toLocaleString('bn-BD')} কাজ উপলব্ধ
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-8 md:p-12 gradient-hero text-primary-foreground">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              আজই একজন কর্মী হন
            </h2>
            <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">
              যাচাইকৃত মহিলা পেশাদারদের আমাদের কমিউনিটিতে যোগ দিন এবং আপনার নিজের শর্তে আয় শুরু করুন
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-primary">
                বিনামূল্যে শুরু করুন
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
