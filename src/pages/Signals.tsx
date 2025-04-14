
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignalsList from '@/components/SignalsList';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Signals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setCityFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 mt-4 md:mt-8">
        <div className="text-center mb-8 md:mb-12 mt-16 md:mt-0 mobile:mt-24">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Всички сигнали</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Прегледайте всички одобрени сигнали, подадени от наши потребители. Използвайте филтрите, за да намерите по-лесно това, което търсите.
          </p>
        </div>
        
        <Card className="mb-6 md:mb-8 glass">
          <CardContent className="p-4 md:p-6">
            {isMobile ? (
              <>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Търси по заглавие, описание или град..."
                    className="pl-10 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2" 
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Филтри</span>
                  </Button>
                  
                  {(searchQuery || categoryFilter !== 'all' || cityFilter !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearFilters}
                      className="text-sm"
                    >
                      Изчисти всички
                    </Button>
                  )}
                </div>
                
                {showFilters && (
                  <div className="grid grid-cols-1 gap-3 mt-4 animate-fade-in">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Избери категория" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Всички категории</SelectItem>
                        <SelectItem value="Екология">Екология</SelectItem>
                        <SelectItem value="Инфраструктура">Инфраструктура</SelectItem>
                        <SelectItem value="Бедствие">Бедствие</SelectItem>
                        <SelectItem value="Друго">Друго</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Избери град" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Всички градове</SelectItem>
                        <SelectItem value="София">София</SelectItem>
                        <SelectItem value="Пловдив">Пловдив</SelectItem>
                        <SelectItem value="Варна">Варна</SelectItem>
                        <SelectItem value="Бургас">Бургас</SelectItem>
                        <SelectItem value="Русе">Русе</SelectItem>
                        <SelectItem value="Стара Загора">Стара Загора</SelectItem>
                        <SelectItem value="Плевен">Плевен</SelectItem>
                        <SelectItem value="Друг">Друг</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Търси по заглавие, описание или град..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Избери категория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всички категории</SelectItem>
                    <SelectItem value="Екология">Екология</SelectItem>
                    <SelectItem value="Инфраструктура">Инфраструктура</SelectItem>
                    <SelectItem value="Бедствие">Бедствие</SelectItem>
                    <SelectItem value="Друго">Друго</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Избери град" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всички градове</SelectItem>
                    <SelectItem value="София">София</SelectItem>
                    <SelectItem value="Пловдив">Пловдив</SelectItem>
                    <SelectItem value="Варна">Варна</SelectItem>
                    <SelectItem value="Бургас">Бургас</SelectItem>
                    <SelectItem value="Русе">Русе</SelectItem>
                    <SelectItem value="Стара Загора">Стара Загора</SelectItem>
                    <SelectItem value="Плевен">Плевен</SelectItem>
                    <SelectItem value="Друг">Друг</SelectItem>
                  </SelectContent>
                </Select>
              
                <div className="flex justify-end md:col-span-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    Изчисти филтрите
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <SignalsList 
          allSignals={true}
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          cityFilter={cityFilter}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Signals;
