import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationButton from './NotificationButton';
const ActionButtons = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Функция за подаване на сигнал
  const handleSubmitSignal = () => {
    navigate('/submit-signal');
  };
  return;
};
export default ActionButtons;