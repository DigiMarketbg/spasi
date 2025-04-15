
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SignalHeader from '@/components/signal/SignalHeader';
import SignalContent from '@/components/signal/SignalContent';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { detailCardStyles } from '@/lib/card-styles';

const SignalDetailPublic = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [signal, setSignal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shareVisible, setShareVisible] = useState(false);
  
  useEffect(() => {
    // Show share button with animation after a delay on mobile
    if (isMobile && signal) {
      const timer = setTimeout(() => setShareVisible(true), 500);
      return () => clearTimeout(timer);
    }
    
    // Always show share button on desktop
    if (!isMobile && signal) {
      setShareVisible(true);
    }
  }, [isMobile, signal]);
  
  useEffect(() => {
    const fetchSignalDetails = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('signals')
          .select('*')
          .eq('id', id)
          .eq('is_approved', true)
          .maybeSingle();
          
        if (error) throw error;
        if (!data) throw new Error('Сигналът не е намерен или не е одобрен.');
        
        setSignal(data);
      } catch (error: any) {
        toast({
          title: "Грешка",
          description: "Сигналът не може да бъде зареден или не е одобрен.",
          variant: "destructive"
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
        url: window.location.href
      }).catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Успешно копиране",
        description: "Линкът е копиран в клипборда"
      });
    }
  };
  
  const renderLoading = () => (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  );

  const containerClassName = signal?.is_resolved 
    ? `${detailCardStyles.container} border-green-200 dark:border-green-800/30` 
    : detailCardStyles.container;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 mt-16 md:mt-24">
        <Card className={containerClassName}>
          <CardHeader className={`${detailCardStyles.header} pb-6 sm:pb-8 border-b border-border/20`}>
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : signal ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <SignalHeader signal={signal} formatDate={formatDate} />
                
                {!isMobile && shareVisible && (
                  <Button 
                    onClick={handleShare}
                    className="w-full md:w-auto bg-spasi-red hover:bg-spasi-red/90"
                    size="sm"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Сподели
                  </Button>
                )}
              </div>
            ) : null}
          </CardHeader>
          
          <CardContent className="p-0 pt-6 sm:pt-8 py-0">
            {loading ? (
              <div className="p-4 sm:p-6">
                {renderLoading()}
              </div>
            ) : signal ? (
              <div className={detailCardStyles.content}>
                <SignalContent signal={signal} formatDate={formatDate} />
              </div>
            ) : null}
          </CardContent>
        </Card>
        
        {/* Mobile floating share button */}
        {signal && isMobile && shareVisible && (
          <button
            onClick={handleShare}
            className={detailCardStyles.shareButton}
            aria-label="Сподели"
          >
            <Share2 className="h-5 w-5" />
          </button>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SignalDetailPublic;
