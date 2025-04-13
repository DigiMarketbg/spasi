
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
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SignalHeader from '@/components/signal/SignalHeader';
import SignalContent from '@/components/signal/SignalContent';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

const SignalDetailPublic = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      
      <main className="flex-grow container mx-auto px-4 py-16 mt-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/signals')} 
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Обратно към всички сигнали
        </Button>

        <Card className="glass">
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
