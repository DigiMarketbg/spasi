
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/AuthProvider';
import WitnessesList from '@/components/witnesses/WitnessesList';
import { fetchApprovedWitnesses } from '@/lib/api/witnesses';

const Witnesses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: witnesses = [], isLoading, error } = useQuery({
    queryKey: ['witnesses', 'approved'],
    queryFn: fetchApprovedWitnesses,
  });

  const filteredWitnesses = witnesses.filter(witness => 
    witness.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    witness.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    witness.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Търсене на свидетели</h1>
              <p className="text-muted-foreground">
                Търсите или сте свидетел на инцидент? Публикувайте или намерете информация тук.
              </p>
            </div>
            
            {user && (
              <Button 
                className="mt-4 md:mt-0 bg-spasi-red hover:bg-spasi-red/90"
                onClick={() => navigate('/submit-witness')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Публикувай сигнал за свидетел
              </Button>
            )}
          </div>
          
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Търси по заглавие, описание или местоположение..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
              <h3 className="text-lg font-medium">Грешка при зареждане на данните</h3>
              <p className="text-sm text-muted-foreground">
                Моля, опитайте отново по-късно или се свържете с администратор.
              </p>
            </div>
          ) : (
            <WitnessesList 
              witnesses={filteredWitnesses} 
              isLoading={isLoading} 
              searchQuery={searchQuery}
            />
          )}
          
          {!user && (
            <div className="mt-8 p-6 border border-muted-foreground/20 rounded-lg bg-muted/30 text-center">
              <h3 className="text-lg font-medium mb-2">Искате да публикувате сигнал за свидетел?</h3>
              <p className="mb-4 text-muted-foreground">Трябва първо да влезете в акаунта си</p>
              <Button onClick={() => navigate('/auth')}>
                Вход / Регистрация
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Witnesses;
