
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting?: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-spasi-red hover:bg-spasi-red/90"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Изпращане...' : 'Изпрати заявка'}
    </Button>
  );
};

export default SubmitButton;
