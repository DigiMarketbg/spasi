
import React from 'react';
import { Shield, Users, Star, Eye, HandHeart, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/ThemeProvider';

const FeatureButtons = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Navigation functions
  const navigateToRescuers = () => {
    navigate('/rescuers');
  };

  const navigateToVolunteers = () => {
    navigate('/volunteers');
  };

  const navigateToDangerousAreas = () => {
    navigate('/dangerous-areas');
  };
  
  const navigateToWitnesses = () => {
    navigate('/witnesses');
  };

  const navigateToGoodDeeds = () => {
    navigate('/good-deeds');
  };

  const navigateToPets = () => {
    navigate('/pets');
  };

  // Style for feature buttons based on theme
  const featureButtonStyle = theme === 'light' 
    ? "w-[80px] h-[80px] bg-spasi-red/10 backdrop-blur-sm border-2 border-spasi-red text-black rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-spasi-red/20"
    : "w-[80px] h-[80px] bg-background/10 backdrop-blur-sm border-2 border-spasi-red text-white rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-transform hover:scale-105 hover:bg-background/20";

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
        <Star className={`h-5 w-5 mb-1 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
        <span className="text-[0.5rem] truncate w-[60px] text-center leading-tight flex flex-col">
          <span>Опасни</span>
          <span>Участъци</span>
        </span>
      </Button>
      
      {/* Button 4: Свидетели */}
      <Button 
        className={featureButtonStyle}
        onClick={navigateToWitnesses}
      >
        <Eye className={`h-5 w-5 mb-1 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
        <span className="text-[0.6rem] truncate w-[60px] text-center">Свидетели</span>
      </Button>
      
      {/* Button 5: Към добрините */}
      <Button 
        className={featureButtonStyle}
        onClick={navigateToGoodDeeds}
      >
        <HandHeart className={`h-5 w-5 mb-1 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
        <span className="text-[0.5rem] truncate w-[60px] text-center leading-tight flex flex-col">
          <span>Към</span>
          <span>добрините</span>
        </span>
      </Button>

      {/* Button 6: Домашни любимци */}
      <Button 
        className={featureButtonStyle}
        onClick={navigateToPets}
      >
        <Dog className={`h-5 w-5 mb-1 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
        <span className="text-[0.6rem] truncate w-[60px] text-center">Домашни любимци</span>
      </Button>
    </div>
  );
};

export default FeatureButtons;

