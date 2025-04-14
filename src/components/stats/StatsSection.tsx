
import React from 'react';
import { ChartBar, Users, Clock, HeartPulse, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay?: number;
}

const StatItem = ({ icon, value, label, color, delay = 0 }: StatItemProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-xl p-5 flex flex-col items-center text-center"
    >
      <div className={cn("rounded-full p-3 mb-3", color)}>
        {icon}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-1">{value}</h3>
      <p className="text-muted-foreground text-sm">{label}</p>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-10 px-4 md:py-16 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold mb-3"
          >
            Реално въздействие
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Spasi.bg не е просто платформа – това е общност, която прави реална промяна
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatItem 
            icon={<ChartBar className="h-6 w-6 text-white" />} 
            value="316" 
            label="Подадени сигнала" 
            color="bg-primary/90"
            delay={0.1}
          />
          <StatItem 
            icon={<Users className="h-6 w-6 text-white" />} 
            value="122" 
            label="Души помогнали" 
            color="bg-secondary/90"
            delay={0.2}
          />
          <StatItem 
            icon={<HeartPulse className="h-6 w-6 text-white" />} 
            value="23" 
            label="Случаи с нужда от кръв" 
            color="bg-spasi-red/90"
            delay={0.3}
          />
          <StatItem 
            icon={<ArrowUp className="h-6 w-6 text-white" />} 
            value="9" 
            label="Успешно решени случая с кръв" 
            color="bg-blue-500/90"
            delay={0.4}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-xl max-w-3xl mx-auto text-center"
        >
          <p className="italic">
            "Така хората ще знаят, че платформата не е само идея – тя действа и помага на реалните хора в нужда."
          </p>
          <div className="mt-4">
            <a href="/info" className="text-primary underline text-sm hover:text-primary/80">
              Научете повече за това как Spasi.bg помага
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
