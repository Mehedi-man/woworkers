import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { ConversationList } from '@/components/messages/ConversationList';
import { MessageThread } from '@/components/messages/MessageThread';
import { useConversations } from '@/hooks/useConversations';
import { MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  job_id: string | null;
  contract_id: string | null;
  last_message_at: string;
  created_at: string;
}

export default function Messages() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const {
    conversations,
    profiles,
    jobs,
    unreadCounts,
    loading,
  } = useConversations(user?.id);

  // Handle URL parameter for conversation ID
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
        setIsMobileView(true);
      }
    }
  }, [searchParams, conversations]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileView(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsMobileView(true);
  };

  const handleBack = () => {
    setIsMobileView(false);
    setSelectedConversation(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const getOtherUserProfile = () => {
    if (!selectedConversation) return null;
    const otherUserId = selectedConversation.client_id === user.id
      ? selectedConversation.freelancer_id
      : selectedConversation.client_id;
    return profiles[otherUserId] || null;
  };

  const getJobTitle = () => {
    if (!selectedConversation?.job_id) return undefined;
    return jobs[selectedConversation.job_id]?.title;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">বার্তা</h1>
          <p className="text-muted-foreground">ক্লায়েন্ট ও ফ্রিল্যান্সারদের সাথে যোগাযোগ করুন</p>
        </div>

        <Card className="h-[calc(100vh-280px)] min-h-[500px] overflow-hidden">
          <div className="flex h-full">
            {/* Conversation List - Hidden on mobile when viewing thread */}
            <div className={`w-full md:w-80 border-r flex flex-col ${isMobileView ? 'hidden md:flex' : 'flex'}`}>
              <ConversationList
                conversations={conversations}
                profiles={profiles}
                jobs={jobs}
                unreadCounts={unreadCounts}
                selectedId={selectedConversation?.id || null}
                currentUserId={user.id}
                loading={loading}
                onSelect={handleSelectConversation}
              />
            </div>

            {/* Message Thread - Hidden on mobile when viewing list */}
            <div className={`flex-1 flex flex-col ${!isMobileView && !selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {selectedConversation ? (
                <MessageThread
                  conversationId={selectedConversation.id}
                  currentUserId={user.id}
                  otherUserProfile={getOtherUserProfile()}
                  jobTitle={getJobTitle()}
                  onBack={handleBack}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">একটি কথোপকথন নির্বাচন করুন</p>
                  <p className="text-sm">বাম পাশ থেকে একটি কথোপকথন নির্বাচন করে বার্তা পাঠান</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
