
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DangerousAreaFormValues } from '@/types/dangerous-area';
import { addDangerousArea } from '@/lib/api/dangerous-areas';
import { toast } from 'sonner';

interface UseDangerousAreaSubmitProps {
  onSubmitSuccess?: () => void;
}

export const useDangerousAreaSubmit = ({ onSubmitSuccess }: UseDangerousAreaSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (data: DangerousAreaFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Ensure all required fields are passed explicitly and properly typed
      await addDangerousArea({
        location: data.location,
        region: data.region,
        description: data.description,
        severity: data.severity,
        map_link: data.map_link || null,
        reported_by_name: data.reported_by_name || null
      });
      
      toast.success('Опасният участък е докладван успешно', {
        description: 'Сигналът ще бъде прегледан от администратор преди публикуване',
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate('/dangerous-areas');
      }
    } catch (error) {
      console.error('Error submitting dangerous area:', error);
      toast.error('Възникна грешка', {
        description: 'Не успяхме да регистрираме опасния участък. Моля, опитайте отново.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    handleSubmit
  };
};
