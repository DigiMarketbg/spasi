
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SignalCard, { SignalProps } from './SignalCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';

interface SignalsListProps {
  allSignals?: boolean;
  searchQuery?: string;
  categoryFilter?: string;
  cityFilter?: string;
  onSearchChange?: (query: string) => void;
}

const SignalsList = ({ 
  allSignals = false, 
  searchQuery = '', 
  categoryFilter = 'all', 
  cityFilter = 'all',
  onSearchChange
}: SignalsListProps) => {
  const isMobile = useIsMobile();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  
  const { 
    data: signals, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['signals', allSignals, localSearchQuery, categoryFilter, cityFilter],
    queryFn: async () => {
      let query = supabase
        .from('signals')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      // Apply limit only for homepage
      if (!allSignals) {
        query = query.limit(6);
      }
      
      // Apply search query filter if present
      if (localSearchQuery) {
        query = query.or(`title.ilike.%${localSearchQuery}%,description.ilike.%${localSearchQuery}%,city.ilike.%${localSearchQuery}%`);
      }
      
      // Apply category filter if present and not "all"
      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      
      // Apply city filter if present and not "all"
      if (cityFilter && cityFilter !== 'all') {
        query = query.eq('city', cityFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(signal => ({
        id: signal.id,
        title: signal.title,
        city: signal.city,
        category: signal.category,
        description: signal.description,
        phone: signal.phone,
        createdAt: format(new Date(signal.created_at), 'd MMMM yyyy', { locale: bg }),
        categoryColor: getCategoryColor(signal.category),
        isResolved: signal.is_resolved || false
      } as SignalProps)) || [];
    },
    enabled: true
  });

  // Handle real-time search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setLocalSearchQuery(newQuery);
    
    if (onSearchChange) {
      onSearchChange(newQuery);
    }
  };
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => refetch(), 300);
    return () => clearTimeout(timer);
  }, [localSearchQuery, refetch]);

  // Function to get color based on category
  const getCategoryColor = (category: string): string => {
    switch(category) {
      case 'Екология':
        return '#43a047';
      case 'Инфраструктура':
        return '#1e88e5';
      case 'Бедствие':
        return '#e53935';
      default:
        return '#ff9800';
    }
  };

  // Effect to refetch when filters change
  useEffect(() => {
    refetch();
  }, [categoryFilter, cityFilter, refetch]);

  return (
    <section className={`${allSignals ? '' : 'py-8 md:py-16 px-4 md:px-6 lg:px-8'}`} id="signals">
      <div className="container mx-auto">
        {!allSignals && (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Последни сигнали</h2>
            <p className="text-center text-muted-foreground mb-8 md:mb-12">Най-новите сигнали от нашата платформа</p>
          </>
        )}
        
        {allSignals && (
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Input
                placeholder="Търсене в сигналите..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="py-10 md:py-20 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-muted mb-4"></div>
              <div className="h-4 w-48 bg-muted rounded mb-2"></div>
              <div className="h-3 w-32 bg-muted rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="py-10 md:py-20 text-center text-destructive">
            <p>Грешка при зареждане на сигнали</p>
          </div>
        ) : signals?.length === 0 ? (
          <div className="py-10 md:py-20 text-center">
            <p className="text-xl mb-4">Няма сигнали по зададените критерии.</p>
            <p className="text-muted-foreground">Моля, опитайте с различни критерии за търсене.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
            
            {!allSignals && signals.length > 0 && (
              <div className="flex justify-center mt-8 md:mt-12">
                <Button 
                  variant="outline" 
                  className="border-2 px-6 py-5 md:px-8 md:py-6 rounded-lg text-base md:text-lg font-medium group"
                  asChild
                >
                  <Link to="/signals">
                    <span>Виж всички сигнали</span>
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SignalsList;
