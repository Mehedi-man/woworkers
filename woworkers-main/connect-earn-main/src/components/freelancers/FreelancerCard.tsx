import { Link } from 'react-router-dom';
import { FreelancerProfile } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, 
  MapPin, 
  DollarSign, 
  CheckCircle,
  TrendingUp,
  Heart
} from 'lucide-react';

interface FreelancerCardProps {
  freelancer: FreelancerProfile;
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const getAvailabilityColor = () => {
    switch (freelancer.availability) {
      case 'available':
        return 'success';
      case 'limited':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getAvailabilityText = () => {
    switch (freelancer.availability) {
      case 'available':
        return 'এখনই উপলব্ধ';
      case 'limited':
        return 'সীমিত উপলব্ধতা';
      default:
        return 'উপলব্ধ নয়';
    }
  };

  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 border-border/50 hover:border-primary/20 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-background shadow-soft">
              <span className="font-display text-xl font-bold text-primary">
                {freelancer.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </span>
            </div>
            {freelancer.availability === 'available' && (
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-success border-2 border-card" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link to={`/freelancers/${freelancer.id}`}>
                  <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {freelancer.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{freelancer.location}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {freelancer.bio}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {freelancer.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="skill" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {freelancer.skills.length > 4 && (
                <Badge variant="skill" className="text-xs">
                  +{freelancer.skills.length - 4}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">৳{freelancer.hourlyRate}</span>
                <span className="text-sm text-muted-foreground">/ঘণ্টা</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold">{freelancer.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({freelancer.reviewCount} রিভিউ)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="font-semibold">{freelancer.jobSuccess}%</span>
                <span className="text-sm text-muted-foreground">সাফল্য</span>
              </div>
            </div>

            {/* Earnings & Availability */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>৳{(freelancer.totalEarnings / 1000).toFixed(0)}K+ আয়</span>
              </div>
              <Badge variant={getAvailabilityColor() as any}>
                {getAvailabilityText()}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
