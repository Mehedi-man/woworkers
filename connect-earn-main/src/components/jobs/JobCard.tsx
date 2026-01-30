import { Link } from 'react-router-dom';
import { Job } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Star, 
  Users, 
  Bookmark,
  Verified
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  variant?: 'default' | 'compact';
}

export function JobCard({ job, variant = 'default' }: JobCardProps) {
  const formatBudget = () => {
    if (job.budget.type === 'hourly') {
      return `$${job.budget.min} - $${job.budget.max}/hr`;
    }
    return `$${job.budget.min.toLocaleString()} - $${job.budget.max.toLocaleString()}`;
  };

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-elevated transition-all duration-300 border-border/50 hover:border-primary/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <Link to={`/jobs/${job.id}`}>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {job.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="skill" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 3 && (
                  <Badge variant="skill" className="text-xs">
                    +{job.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-foreground">{formatBudget()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(job.postedAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 border-border/50 hover:border-primary/20 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant={job.budget.type === 'hourly' ? 'info' : 'success'}
                className="text-xs"
              >
                {job.budget.type === 'hourly' ? 'Hourly' : 'Fixed Price'}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {job.experienceLevel}
              </Badge>
            </div>
            <Link to={`/jobs/${job.id}`}>
              <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {job.title}
              </h3>
            </Link>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-primary">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="py-0">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.slice(0, 5).map((skill) => (
            <Badge key={skill} variant="skill">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 5 && (
            <Badge variant="skill">+{job.skills.length - 5}</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium text-foreground">{formatBudget()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{job.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{job.proposals} proposals</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/50 mt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground">
                {job.clientName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{job.clientName}</span>
                <Verified className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {job.clientRating && (
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    {job.clientRating}
                  </span>
                )}
                {job.clientSpent && (
                  <span>${(job.clientSpent / 1000).toFixed(0)}K+ spent</span>
                )}
              </div>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(job.postedAt, { addSuffix: true })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
