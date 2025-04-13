
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent, 
  CardHeader, 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SignalHeader from '@/components/signal/SignalHeader';
import SignalContent from '@/components/signal/SignalContent';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

const SignalDetailPublic = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [signal, setSignal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignalDetails = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('signals')
          .select('*')
          .eq('id', id)
          .eq('is_approved', true)
          .single();

        if (error) throw error;
        setSignal(data);
      } catch (error: any) {
        toast({
          title: "Грешка",
          description: "Сигналът не може да бъде зареден или не е одобрен.",
          variant: "destructive",
        });
        navigate('/signals');
      } finally {
        setLoading(false);
      }
    };

    fetchSignalDetails();
  }, [id, navigate, toast]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: bg });
    } catch {
      const date = new Date(dateString);
      return date.toLocaleDateString('bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: signal?.title || 'Споделяне на сигнал',
        text: signal?.description?.substring(0, 100) || 'Виж този сигнал',
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Успешно копиране",
        description: "Линкът е копиран в клипборда",
      });
    }
  };

  const renderLoading = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-1/3" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 mt-4 md:mt-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/signals')} 
            className="flex items-center gap-2"
            size={isMobile ? "sm" : "default"}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className={isMobile ? "text-sm" : ""}>Назад</span>
          </Button>

          {signal && isMobile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShare} 
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Сподели</span>
            </Button>
          )}
        </div>

        <Card className="glass animate-fade-in">
          <CardHeader>
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : signal ? (
              <SignalHeader signal={signal} formatDate={formatDate} />
            ) : null}
          </CardHeader>
          
          <CardContent>
            {loading ? (
              renderLoading()
            ) : signal ? (
              <SignalContent signal={signal} formatDate={formatDate} />
            ) : null}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignalDetailPublic;
