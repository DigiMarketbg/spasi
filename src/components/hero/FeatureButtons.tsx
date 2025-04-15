import React from 'react';
import { Shield, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/ThemeProvider';

const FeatureButtons = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Функции за навигация към различни страници
  const navigateToRescuers = () => {
    navigate('/rescuers');
  };

  const navigateToVolunteers = () => {
    navigate('/volunteers');
  };

  const navigateToDangerousAreas = () => {
    navigate('/dangerous-areas');
  };

  // Updated style for feature buttons based on theme
  const featureButtonStyle = theme === 'light' 
    ? "w-[80px] h-[80px] bg-spasi-red/10 backdrop-blur-sm border-2 border-spasi-red text-black rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-spasi-red/20"
    : "w-[80px] h-[80px] bg-background/10 backdrop-blur-sm border-2 border-spasi-red text-white rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-background/20";

  const disabledFeatureButtonStyle = theme === 'light'
    ? "w-[80px] h-[80px] bg-spasi-red/5 backdrop-blur-sm border-2 border-spasi-red/30 text-black/50 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-transform opacity-70 cursor-not-allowed"
    : "w-[80px] h-[80px] bg-background/10 backdrop-blur-sm border-2 border-spasi-red text-white rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-background/20 opacity-70 cursor-not-allowed";

  return (
    <div className="flex flex-row flex-wrap justify-center gap-2 mt-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
      {/* Button 1: Спасители */}
      <Button 
        className={featureButtonStyle}
        onClick={navigateToRescuers}
      >
        <Shield className={`h-5 w-5 mb-1 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
        <span className="text-[0.6rem] truncate w-[60px] text-center">Спасители</span>
      </Button>
      
      {/* Button 2: Доброволци */}
      <Button 
        className={featureButtonStyle}
        onClick={navigateToVolunteers}
      >
        <Users className={`h-5 w-5 mb-1 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
        <span className="text-[0.6rem] truncate w-[60px] text-center">Доброволци</span>
      </Button>
    
      {/* Button 3: Опасни участъци */}
      <Button 
        className={featureButtonStyle}
        onClick={navigateToDangerousAreas}
      >
        <span className="text-[0.5rem] truncate w-[60px] text-center leading-tight flex flex-col">
          <span>Опасни</span>
          <span>Участъци</span>
        </span>
      </Button>
      
      {/* Button 4: Placeholder */}
      <Button 
        className={disabledFeatureButtonStyle}
        disabled
      >
        <Star className={`h-5 w-5 mb-1 ${theme === 'light' ? 'text-spasi-red/50' : 'text-white'}`} />
        <span className="text-[0.6rem] truncate w-[60px] text-center">Бутон 4</span>
      </Button>
    </div>
  );
};

export default FeatureButtons;
