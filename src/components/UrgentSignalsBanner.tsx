
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Siren, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/ThemeProvider';

// Define a type for the transformed signal data to avoid recursive references
interface UrgentSignalDisplay {
  id: string;
  title: string;
  city: string;
  category: string;
  description: string;
  createdAt: string;
}

const UrgentSignalsBanner = () => {
  const { theme } = useTheme();
  
  const { data: urgentSignals, isLoading } = useQuery({
    queryKey: ['urgentSignals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .eq('is_approved', true)
        .eq('is_urgent', true)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data?.map(signal => ({
        id: signal.id,
        title: signal.title,
        city: signal.city,
        category: signal.category,
        description: signal.description,
        createdAt: format(new Date(signal.created_at), 'd MMMM yyyy', { locale: bg }),
      } as UrgentSignalDisplay)) || [];
    },
    enabled: true
  });
  
  if (isLoading || !urgentSignals || urgentSignals.length === 0) {
    return null; // Don't render anything if no urgent signals
  }

  // Dynamic styles based on theme
  const containerBackground = theme === 'dark' 
    ? 'bg-gradient-to-r from-red-900/20 to-red-700/30 dark:border-red-900/40' 
    : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200';
  
  const titleColor = theme === 'dark' ? 'text-red-300' : 'text-red-700';
  const iconColor = theme === 'dark' ? 'text-red-300' : 'text-red-600';

  return (
    <div className="container mx-auto mb-8">
      <div className={`relative animate-pulse-light ${containerBackground} rounded-lg border-2 border-red-500 p-4 shadow-lg`}>
        <div className="absolute -top-3 -left-2 bg-red-600 text-white px-3 py-1 rounded-lg font-bold flex items-center shadow-md">
          <Siren className="h-4 w-4 mr-1" />
          <span>СПЕШЕН СИГНАЛ</span>
        </div>
        
        {urgentSignals.map((signal) => (
          <div key={signal.id} className="mt-2">
            <h3 className={`text-xl font-bold ${titleColor}`}>{signal.title}</h3>
            
            <div className="flex items-center gap-4 my-2">
              <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-800/60">
                {signal.category}
              </Badge>
              <span className="text-sm text-muted-foreground">{signal.city}</span>
              <span className="text-sm text-muted-foreground">{signal.createdAt}</span>
            </div>
            
            <p className="line-clamp-2 mb-3 text-muted-foreground">
              {signal.description}
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-400 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
              asChild
            >
              <Link to={`/signal/${signal.id}`}>
                <span>Разгледай спешния сигнал</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrgentSignalsBanner;
