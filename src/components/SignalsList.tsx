
import React from 'react';
import SignalCard, { SignalProps } from './SignalCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

// Sample data for the signals
const recentSignals: SignalProps[] = [
  {
    id: 1,
    title: 'Спешна нужда от кръводаряване',
    city: 'София',
    category: 'Кръводаряване',
    description: 'Спешна нужда от кръв група A+ за операция. Болница "Св. Иван Рилски".',
    createdAt: 'преди 2 часа',
    categoryColor: '#e53935'
  },
  {
    id: 2,
    title: 'Наводнение в Квартал Дружба',
    city: 'Пловдив',
    category: 'Бедствие',
    description: 'Наводнени са приземни етажи на няколко блока. Нужни са доброволци за помощ с изпомпване на водата.',
    createdAt: 'преди 5 часа',
    categoryColor: '#1976d2'
  },
  {
    id: 3,
    title: 'Открадната кола от паркинг',
    city: 'Варна',
    category: 'Кражба',
    description: 'Откраднат Фолксваген Голф, сив, с регистрация B 1234 AB от паркинга пред блок 15.',
    createdAt: 'преди 12 часа',
    categoryColor: '#ff9800'
  },
  {
    id: 4,
    title: 'Опасен участък на пътя след дъжд',
    city: 'Бургас',
    category: 'Опасност',
    description: 'Подхлъзване на пътя Бургас-Слънчев бряг при километър 34. Внимавайте при шофиране в участъка.',
    createdAt: 'преди 1 ден',
    categoryColor: '#ff5722'
  },
  {
    id: 5,
    title: 'Изгубено куче в парка',
    city: 'Русе',
    category: 'Изгубени',
    description: 'Изгубено куче порода бигъл, мъжко, с червен нашийник в Градската градина. Отзовава се на Рекс.',
    createdAt: 'преди 1 ден',
    categoryColor: '#8bc34a'
  },
  {
    id: 6,
    title: 'Нужда от доброволци за почистване',
    city: 'Стара Загора',
    category: 'Доброволци',
    description: 'Организираме почистване на градския парк в събота от 9:00 сутринта. Нужни са доброволци.',
    createdAt: 'преди 2 дни',
    categoryColor: '#43a047'
  }
];

const SignalsList = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">Последни сигнали</h2>
        <p className="text-center text-muted-foreground mb-12">Най-новите сигнали от нашата платформа</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentSignals.map((signal, index) => (
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
          >
            <span>Виж всички сигнали</span>
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SignalsList;
