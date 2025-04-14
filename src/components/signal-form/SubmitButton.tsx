
import { Send, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isUploading?: boolean; // Making this optional with a default value
}

const SubmitButton = ({ isSubmitting, isUploading = false }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      disabled={isSubmitting || isUploading}
      className="w-full bg-gradient-to-r from-[#d53369] to-[#daae51] hover:from-[#c62e5e] hover:to-[#c69d47] text-white font-bold py-3"
    >
      {isSubmitting || isUploading ? (
        <span className="flex items-center gap-2">
          <Upload className={`h-4 w-4 ${isUploading ? "animate-pulse" : "animate-spin"}`} />
          {isUploading ? "Качване на изображение..." : "Изпращане..."}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Изпрати сигнал
        </span>
      )}
    </Button>
  );
};

export default SubmitButton;
