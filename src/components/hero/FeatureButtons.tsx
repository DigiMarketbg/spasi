
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
    ? "w-[90px] h-[90px] bg-background border-2 border-spasi-red text-black rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-transform hover:scale-105"
    : "w-[90px] h-[90px] bg-black border-2 border-spasi-red text-white rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-transform hover:scale-105";

  return (
    <div className="mt-8 animate-fade-in px-4" style={{animationDelay: '0.5s'}}>
      {/* First row */}
      <div className="flex justify-center gap-6 mb-6">
        {/* Button 1: Спасители */}
        <Button 
          className={featureButtonStyle}
          onClick={navigateToRescuers}
        >
          <Shield className={`h-6 w-6 mb-2 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
          <span className="text-[0.75rem] w-full text-center">Спасители</span>
        </Button>
        
        {/* Button 2: Доброволци */}
        <Button 
          className={featureButtonStyle}
          onClick={navigateToVolunteers}
        >
          <Users className={`h-6 w-6 mb-2 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
          <span className="text-[0.75rem] w-full text-center">Доброволци</span>
        </Button>
      
        {/* Button 3: Опасни участъци */}
        <Button 
          className={featureButtonStyle}
          onClick={navigateToDangerousAreas}
        >
          <Star className={`h-6 w-6 mb-2 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
          <span className="text-[0.7rem] w-full text-center leading-tight flex flex-col">
            <span>Опасни</span>
            <span>Участъци</span>
          </span>
        </Button>
      </div>
      
      {/* Second row */}
      <div className="flex justify-center gap-6">
        {/* Button 4: Свидетели */}
        <Button 
          className={featureButtonStyle}
          onClick={navigateToWitnesses}
        >
          <Eye className={`h-6 w-6 mb-2 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
          <span className="text-[0.75rem] w-full text-center">Свидетели</span>
        </Button>
        
        {/* Button 5: Към добрините */}
        <Button 
          className={featureButtonStyle}
          onClick={navigateToGoodDeeds}
        >
          <HandHeart className={`h-6 w-6 mb-2 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
          <span className="text-[0.7rem] w-full text-center leading-tight flex flex-col">
            <span>Към</span>
            <span>добрините</span>
          </span>
        </Button>

        {/* Button 6: Домашни любимци */}
        <Button 
          className={featureButtonStyle}
          onClick={navigateToPets}
        >
          <Dog className={`h-6 w-6 mb-2 ${theme === 'light' ? 'text-spasi-red' : 'text-white'}`} />
          <span className="text-[0.7rem] w-full text-center leading-tight flex flex-col">
            <span>Домашни</span>
            <span>любимци</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default FeatureButtons;
