import React, { useState, useEffect } from 'react';
import { Search, Bell, AlertTriangle, Shield, Users, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ParticleBackground from './ParticleBackground';
import MovingElements from './MovingElements';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  title: string;
  city: string;
}

const HeroSection = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Функция за абониране за известия
  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      
      if (window.OneSignal) {
        // Проверяваме дали потребителят вече е абониран
        const isPushEnabled = await window.OneSignal.User.PushSubscription.optedIn;
        
        if (isPushEnabled) {
          toast({
            title: "Вече сте абонирани",
            description: "Вече получавате известия от платформата",
          });
        } else {
          // Използваме стандартния OneSignal прозорец за абониране
          window.OneSignal.Slidedown.promptPush({
            force: true // Това ще покаже прозореца дори ако потребителят вече го е отхвърлил
          });
          
          // Добавяме слушател за промяна на статуса на абонамента
          const unsubscribe = window.OneSignal.User.PushSubscription.addEventListener('change', async (event) => {
            const isNowEnabled = await window.OneSignal.User.PushSubscription.optedIn;
            
            if (isNowEnabled) {
              toast({
                title: "Успешно абониране",
                description: "Вече ще получавате известия за нови сигнали",
              });
              
              // Премахваме слушателя след успешно абониране
              unsubscribe();
            }
          });
        }
      } else {
        console.error("OneSignal not available");
        toast({
          title: "Грешка",
          description: "OneSignal не е наличен. Моля, опитайте отново по-късно.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при абониране за известия",
        variant: "destructive",
        });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Функция за търсене в реално време
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const { data, error } = await supabase
          .from('signals')
          .select('id, title, city')
          .eq('is_approved', true)
          .or(`title.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
          .limit(5);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('Error searching signals:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Функция за обработка на търсенето при натискане на Enter
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowResults(false);
      navigate(`/signals?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Функция за подаване на сигнал
  const handleSubmitSignal = () => {
    navigate('/submit-signal');
  };

  // Затваряне на резултатите при клик извън полето
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Функции за навигация към различни страници
  const navigateToRescuers = () => {
    navigate('/rescuers');
  };

  const navigateToVolunteers = () => {
    navigate('/volunteers');
  };

  return (
    <section className="relative py-20 px-4 md:px-6 lg:px-8 overflow-hidden min-h-[80vh] flex items-center">
      <ParticleBackground count={80} />
      <MovingElements />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fade-in">
            Когато всяка минута е важна.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Spasi.bg е платформата за сигнали при спешни случаи и взаимопомощ.
          </p>
          
          <div className="max-w-xl mx-auto mb-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Търсене по дума или град..." 
                className="pr-10 py-6 text-lg rounded-lg border-2 border-spasi-red focus:ring-2 focus:ring-spasi-red"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (searchResults.length > 0) {
                    setShowResults(true);
                  }
                }}
                onKeyDown={handleSearch}
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (searchQuery.trim()) {
                    setShowResults(false);
                    navigate(`/signals?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              />
              
              {/* Live search results dropdown */}
              {showResults && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border border-input rounded-lg mt-1 shadow-lg z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <div className="animate-pulse">Търсене...</div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul>
                      {searchResults.map((result) => (
                        <li key={result.id}>
                          <button
                            className="w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors flex justify-between items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/signals/${result.id}`);
                              setShowResults(false);
                            }}
                          >
                            <span className="font-medium">{result.title}</span>
                            <span className="text-sm text-muted-foreground">{result.city}</span>
                          </button>
                        </li>
                      ))}
                      <li className="border-t border-input">
                        <button
                          className="w-full text-center px-4 py-2 text-primary hover:bg-accent/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/signals?search=${encodeURIComponent(searchQuery)}`);
                            setShowResults(false);
                          }}
                        >
                          Виж всички резултати
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Няма намерени резултати
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
            {!isMobile && (
              <Button 
                className="bg-spasi-red hover:bg-spasi-red/90 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2 relative group overflow-hidden"
                onClick={handleSubmitSignal}
              >
                <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                <AlertTriangle className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Подай сигнал</span>
              </Button>
            )}
            
            {/* Notification Subscribe Button */}
            <Button
              className="bg-spasi-green hover:bg-spasi-green/90 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2 relative group overflow-hidden"
              onClick={handleSubscribe}
              disabled={isSubscribing}
            >
              <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
              <Bell className="h-5 w-5 relative z-10" />
              <span className="relative z-10">{isSubscribing ? "Обработка..." : "Абонирай се"}</span>
            </Button>
          </div>
          
          {/* Updated smaller buttons in a single row with consistent style */}
          <div className="flex flex-row justify-center gap-2 mt-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
            {/* Button 1: Спасители */}
            <Button 
              className="w-[80px] h-[80px] bg-background/10 backdrop-blur-sm border-2 border-spasi-red text-white rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 hover:bg-background/20"
              onClick={navigateToRescuers}
            >
              <Shield className="h-5 w-5 mb-1" />
              <span className="text-[0.65rem] truncate max-w-full">Спасители</span>
            </Button>
            
            {/* Button 2: Доброволци */}
            <Button 
              className="w-[80px] h-[80px] bg-background/10 backdrop-blur-sm border-2 border-spasi-red text-white rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 hover:bg-background/20"
              onClick={navigateToVolunteers}
            >
              <Users className="h-5 w-5 mb-1" />
              <span className="text-[0.65rem] truncate max-w-full">Доброволци</span>
            </Button>
            
            {/* Button 3: Placeholder */}
            <Button 
              className="w-[80px] h-[80px] bg-background/10 backdrop-blur-sm border-2 border-spasi-red text-white rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 hover:bg-background/20 opacity-70 cursor-not-allowed"
              disabled
            >
              <Award className="h-5 w-5 mb-1" />
              <span className="text-[0.65rem] truncate max-w-full">Бутон 3</span>
            </Button>
            
            {/* Button 4: Placeholder */}
            <Button 
              className="w-[80px] h-[80px] bg-background/10 backdrop-blur-sm border-2 border-spasi-red text-white rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 hover:bg-background/20 opacity-70 cursor-not-allowed"
              disabled
            >
              <Star className="h-5 w-5 mb-1" />
              <span className="text-[0.65rem] truncate max-w-full">Бутон 4</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
