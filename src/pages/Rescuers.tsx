
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
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Спасители</h1>
            <p className="text-muted-foreground mb-6">
              Тук отбелязваме хората, които са направили разлика. Благодарим на всички, които помагат и спасяват!
            </p>
            
            {/* Search Bar */}
            <div className="mb-8 relative">
              <div className="relative">
                <Input
                  placeholder="Търсене по име или град..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
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
              <div className="space-y-6">
                {filteredRescuers.map((rescuer) => (
                  <Card key={rescuer.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {rescuer.image_url && (
                          <div className="flex-shrink-0">
                            <div className="w-full md:w-48 h-48 rounded-md overflow-hidden">
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
                              <h3 className="text-xl font-semibold">{rescuer.name}</h3>
                              <p className="text-sm text-muted-foreground">{rescuer.city} • {formatDate(rescuer.help_date)}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="whitespace-pre-line">{rescuer.help_description}</p>
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
