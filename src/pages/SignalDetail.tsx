
// Import necessary modules and components
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSignalById, deleteSignal } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/AuthProvider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Import the icons from lucide-react
import { Trash2, Share2 } from 'lucide-react';

// Define the SignalDetail component
const SignalDetail = () => {
  // Get the signal ID from the route params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Fetch the signal data using the useQuery hook
  const { data: signal, isLoading, isError } = useQuery({
    queryKey: ['signal', id],
    queryFn: () => getSignalById(id as string),
  });

  // Define the delete mutation using the useMutation hook
  const deleteMutation = useMutation({
    mutationFn: deleteSignal,
    onSuccess: () => {
      toast({
        title: "Успешно изтриване!",
        description: "Сигналът беше успешно изтрит.",
      });
      queryClient.invalidateQueries({ queryKey: ['signals'] });
      navigate('/admin');
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Грешка при изтриване!",
        description: error.message || "Възникна грешка при изтриването на сигнала. Моля, опитайте пак.",
      });
    },
  });

  // Function to handle the delete action
  const handleDelete = async () => {
    if (id) {
      console.log("Handling delete for signal ID:", id);
      await deleteMutation.mutateAsync(id);
    }
    setIsDeleteDialogOpen(false);
  };
  
  // Function to handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: signal?.title || "Сигнал",
        text: signal?.description?.substring(0, 100) + "..." || "Виж този сигнал",
        url: window.location.href
      }).catch(error => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Линкът е копиран",
        description: "Линкът към сигнала е копиран в клипборда"
      });
    }
  };

  // Render loading state
  if (isLoading) {
    return <div>Зареждане...</div>;
  }

  // Render error state
  if (isError) {
    return <div>Грешка при зареждане на сигнала.</div>;
  }

  // Render the signal details
  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{signal?.title}</CardTitle>
          <CardDescription>Подаден на {formatDate(signal?.created_at || '')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <p className="text-gray-600">Категория: {signal?.category}</p>
              <p className="text-gray-600">Град: {signal?.city}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Описание:</h3>
              <p className="text-gray-700">{signal?.description}</p>
            </div>
            {signal?.image_url && (
              <div>
                <h3 className="text-lg font-semibold">Снимка:</h3>
                <img src={signal.image_url} alt="Signal Image" className="rounded-md" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Обратно
            </Button>
            
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Сподели
            </Button>
          </div>
          
          {user?.role === 'admin' && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    "Изтриване..."
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Изтрий
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Изтриване на сигнал</AlertDialogTitle>
                  <AlertDialogDescription>
                    Сигурни ли сте, че искате да изтриете този сигнал? Това действие не може да бъде отменено.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отказ</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Изтрий
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignalDetail;
