
import { AlertDescription, Alert } from '@/components/ui/alert';

interface ErrorAlertProps {
  error: string | null;
}

const ErrorAlert = ({ error }: ErrorAlertProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
