
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Eye, Calendar, MapPin } from 'lucide-react';
import { fetchApprovedWitnesses } from '@/lib/api/witnesses';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';

const WitnessesSection = () => {
  const navigate = useNavigate();
  
  const { data: witnesses = [], isLoading } = useQuery({
    queryKey: ['homepage-witnesses'],
    queryFn: fetchApprovedWitnesses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Get only the latest 3 witnesses
  const recentWitnesses = witnesses.slice(0, 3);
  
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Търсене на свидетели</h2>
            <p className="text-muted-foreground mt-1">
              Търсите или сте били свидетел на инцидент? Помогнете или намерете информация тук.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/witnesses')}
            className="hidden md:flex"
          >
            Всички обяви
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-[280px]">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : recentWitnesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentWitnesses.map(witness => (
              <Card key={witness.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{witness.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Изтича {formatDistanceToNow(new Date(witness.expires_at), { addSuffix: true, locale: bg })}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <p className="line-clamp-3 mb-4 text-sm">{witness.description}</p>
                  
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{witness.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(witness.date).toLocaleDateString('bg-BG')}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/witness/${witness.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Виж детайли
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-background/60 border border-border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Няма активни обяви за свидетели</h3>
            <p className="text-muted-foreground mb-4">
              В момента няма публикувани обяви за търсене на свидетели.
            </p>
            <Button onClick={() => navigate('/witnesses')}>
              Публикувай обява
            </Button>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Button 
            variant="outline" 
            onClick={() => navigate('/witnesses')}
          >
            Всички обяви
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WitnessesSection;
