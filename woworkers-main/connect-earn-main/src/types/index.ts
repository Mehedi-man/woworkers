export type UserRole = 'client' | 'freelancer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  hourlyRate: number;
  skills: string[];
  location: string;
  availability: 'available' | 'limited' | 'unavailable';
  totalEarnings: number;
  jobSuccess: number;
  successRate: number;
  completedJobs: number;
  rating: number;
  reviewCount: number;
  portfolio: PortfolioItem[];
  certifications: string[];
  isVerified?: boolean;
  safetyRating?: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: {
    type: 'fixed' | 'hourly';
    min: number;
    max: number;
  };
  duration: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  postedAt: Date;
  proposals: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  attachments?: string[];
  location?: string;
  clientSpent?: number;
  clientRating?: number;
  isRemote?: boolean;
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  bidAmount: number;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: Date;
}

export interface Contract {
  id: string;
  jobId: string;
  clientId: string;
  freelancerId: string;
  type: 'fixed' | 'hourly';
  amount: number;
  status: 'active' | 'paused' | 'completed' | 'disputed';
  startDate: Date;
  endDate?: Date;
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'revision';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'proposal' | 'message' | 'contract' | 'payment' | 'review';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}