
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatsSection from '@/components/stats/StatsSection';
import { ArrowRight, Heart, BarChart2, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const HowWeHelp = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-center"
          >
            Как Spasi.bg помага
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg text-center mb-10"
          >
            Реално въздействие върху живота на хората
          </motion.p>
          
          <StatsSection />
          
          <div className="glass p-8 rounded-xl mb-10">
            <h2 className="text-2xl font-bold mb-6">Нашият подход</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Достигаме до нуждаещите се</h3>
                  <p className="text-muted-foreground">
                    Spasi.bg работи активно за разпространение на сигналите до правилните хора и организации, 
                    които могат да помогнат навреме. Нашата платформа позволява бързо идентифициране на нуждите и 
                    ефективно насочване на помощта.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Измерваме резултатите</h3>
                  <p className="text-muted-foreground">
                    Ние не просто свързваме хората в нужда с помощ - ние проследяваме резултатите и измерваме
                    реалното въздействие на всеки сигнал. Това ни позволява постоянно да подобряваме подхода си
                    и да бъдем по-ефективни с всеки следващ случай.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-spasi-red/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-spasi-red" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Бързо реагиране</h3>
                  <p className="text-muted-foreground">
                    Времето е от съществено значение при много спешни случаи. Нашата система е проектирана
                    да позволява бързо реагиране и минимално време за мобилизация на подкрепа при критични ситуации.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Проследяване на случаите</h3>
                  <p className="text-muted-foreground">
                    Не приключваме работата си, когато публикуваме сигнал. Продължаваме да проследяваме случаите,
                    да комуникираме с всички участници и да работим активно за разрешаването им.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Истории на успеха</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-background/50 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-2">Спешна нужда от кръв</h3>
                <p className="text-muted-foreground mb-4">
                  Благодарение на бързата реакция на общността ни, успяхме да намерим 5 дарители 
                  за пациент с рядка кръвна група в рамките на 6 часа след публикуване на сигнала.
                </p>
                <div className="text-sm text-muted-foreground">
                  Преди 3 месеца в София
                </div>
              </div>
              
              <div className="p-4 bg-background/50 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-2">Помощ при природно бедствие</h3>
                <p className="text-muted-foreground mb-4">
                  Координирахме 37 доброволци за помощ при наводнение в Пловдивско, организирайки логистиката, 
                  доставката на храна, вода и други необходими материали за засегнатите.
                </p>
                <div className="text-sm text-muted-foreground">
                  Преди 6 месеца в Пловдив
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <a href="/signals" className="inline-flex items-center text-primary hover:underline">
                Виж всички успешни сигнали <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowWeHelp;
