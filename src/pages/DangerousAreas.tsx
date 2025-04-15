import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, Plus, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import DangerousAreasList from '@/components/dangerous-areas/DangerousAreasList';
import { fetchDangerousAreas } from '@/lib/api/dangerous-areas';
import { DangerousArea } from '@/types/dangerous-area';

const DangerousAreas = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: dangerousAreas = [], isLoading } = useQuery<DangerousArea[]>({
    queryKey: ['dangerous-areas'],
    queryFn: fetchDangerousAreas
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-destructive" /> 
                  Опасни участъци
                </h1>
                <p className="text-muted-foreground">
                  Тук споделяме информация за опасни пътни участъци, за да спасим животи
                </p>
              </div>
              
              <Link to="/add-dangerous-area">
                <Button className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white gap-2">
                  <Plus className="h-4 w-4" /> Добави опасен участък
                </Button>
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="mb-8 relative max-w-md mx-auto">
              <div className="relative">
                <Input
                  placeholder="Търсене по локация..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 border-primary/30 focus-visible:ring-primary/30"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
            </div>
            
            {/* Info card */}
            <Card className="mb-8 border-none shadow-md bg-gradient-to-r from-orange-100/50 to-yellow-100/50 dark:from-orange-900/20 dark:to-yellow-900/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500/20 p-3 rounded-full">
                    <Info className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Помогнете да спасим животи</h3>
                    <p className="text-sm text-muted-foreground">
                      Споделете информация за опасни пътни участъци, които сте забелязали. 
                      Вашият сигнал може да предотврати инциденти и да спаси нечий живот.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* List of dangerous areas */}
            <DangerousAreasList 
              areas={dangerousAreas} 
              isLoading={isLoading} 
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DangerousAreas;
