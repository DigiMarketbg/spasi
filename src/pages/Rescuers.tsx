
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Rescuer {
  id: string;
  name: string;
  city: string;
  help_description: string;
  help_date: string;
  image_url?: string;
  created_at: string;
}

const Rescuers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRescuers, setFilteredRescuers] = useState<Rescuer[]>([]);
  
  const { data: rescuers = [], isLoading } = useQuery({
    queryKey: ['rescuers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rescuers')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    if (rescuers.length > 0) {
      const filtered = rescuers.filter(rescuer => {
        const nameMatch = rescuer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const cityMatch = rescuer.city.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || cityMatch;
      });
      setFilteredRescuers(filtered);
    } else {
      setFilteredRescuers([]);
    }
  }, [searchQuery, rescuers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">Спасители</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Тук отбелязваме хората, които са направили разлика. Благодарим на всички, които помагат и спасяват!
            </p>
            
            {/* Search Bar */}
            <div className="mb-8 relative max-w-md mx-auto">
              <div className="relative">
                <Input
                  placeholder="Търсене по име или град..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 border-primary/30 focus-visible:ring-primary/30"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <p>Зареждане...</p>
              </div>
            ) : filteredRescuers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  {rescuers.length === 0 ? 'Все още няма добавени спасители' : 'Няма намерени спасители по зададените критерии'}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredRescuers.map((rescuer) => (
                  <Card key={rescuer.id} className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 pointer-events-none" />
                    
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl opacity-70 pointer-events-none" />
                    
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                    
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6 relative">
                        {rescuer.image_url && (
                          <div className="flex-shrink-0">
                            <div className="w-full md:w-48 h-48 rounded-md overflow-hidden ring-4 ring-primary/10 shadow-xl">
                              <img 
                                src={rescuer.image_url} 
                                alt={rescuer.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{rescuer.name}</h3>
                              <p className="text-sm font-medium mb-4 flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-1"></span>
                                {rescuer.city} • {formatDate(rescuer.help_date)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-2 bg-white/50 dark:bg-slate-900/50 p-4 rounded-md shadow-inner relative">
                            <div className="absolute -top-1 -bottom-1 -left-1 -right-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-md blur-sm opacity-50 pointer-events-none" />
                            <p className="whitespace-pre-line relative font-medium text-foreground/90">{rescuer.help_description}</p>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <div className="inline-flex items-center text-xs text-muted-foreground">
                              <span className="inline-block w-3 h-3 bg-gradient-to-tr from-primary to-secondary rounded-full mr-2"></span>
                              Благодарим за проявения героизъм
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rescuers;
