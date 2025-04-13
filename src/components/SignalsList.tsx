
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SignalCard, { SignalProps } from './SignalCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

const SignalsList = () => {
  const { 
    data: signals, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['latestSignals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      
      return data?.map(signal => ({
        id: signal.id,
        title: signal.title,
        city: signal.city,
        category: signal.category,
        description: signal.description,
        createdAt: format(new Date(signal.created_at), 'd MMMM yyyy', { locale: bg }),
      } as SignalProps)) || [];
    }
  });

  if (isLoading) return <div>Зареждане на сигнали...</div>;
  if (error) return <div>Грешка при зареждане на сигнали</div>;

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8" id="signals">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">Последни сигнали</h2>
        <p className="text-center text-muted-foreground mb-12">Най-новите сигнали от нашата платформа</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals?.map((signal, index) => (
            <div 
              key={signal.id} 
              className="opacity-0 animate-fade-in" 
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <SignalCard signal={signal} />
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Button 
            variant="outline" 
            className="border-2 px-8 py-6 rounded-lg text-lg font-medium group"
            asChild
          >
            <Link to="/signals">
              <span>Виж всички сигнали</span>
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SignalsList;
