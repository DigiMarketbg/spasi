
// Changed to add error handling fix for non-JSON response in fetchAllPetPosts

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface PetPost {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url?: string | null;
  created_at: string;
  is_approved: boolean;
  status: string;
}

interface PetsTabContentProps {
  onRefresh?: () => void;
}

// fetch all pet posts for admin (pending and approved)
async function fetchAllPetPosts(): Promise<PetPost[]> {
  const res = await fetch('/api/admin/pet-posts');
  if (!res.ok) {
    // Try reading text in case it's not JSON (e.g. HTML error page)
    let errorText = await res.text();
    // Attempt to extract a meaningful snippet to show
    errorText = errorText.length > 200 ? errorText.slice(0, 200) + '...' : errorText;
    throw new Error('Error fetching pet posts: ' + errorText);
  }
  // Ensure response content-type is JSON before parsing
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error('Expected JSON response but received: ' + (text.length > 200 ? text.slice(0, 200) + '...' : text));
  }
  const data = await res.json();
  return data;
}

async function approvePetPost(id: string): Promise<void> {
  const res = await fetch(`/api/admin/pet-posts/${id}/approve`, { method: 'POST' });
  if (!res.ok) throw new Error('Неуспешно одобрение');
}

async function rejectPetPost(id: string): Promise<void> {
  const res = await fetch(`/api/admin/pet-posts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Неуспешно отхвърляне');
}

const PetsTabContent: React.FC<PetsTabContentProps> = ({ onRefresh }) => {
  const { toast } = useToast();
  const { data: pets = [], isLoading, error, refetch } = useQuery<PetPost[]>({
    queryKey: ['admin-pet-posts'],
    queryFn: fetchAllPetPosts,
  });

  const [processingId, setProcessingId] = useState<string | null>(null);

  const approvePet = async (id: string) => {
    setProcessingId(id);
    try {
      await approvePetPost(id);
      toast({
        title: 'Успешно',
        description: 'Домашният любимец е одобрен.',
      });
      await refetch();
      onRefresh?.();
    } catch (e: any) {
      toast({
        title: 'Грешка',
        description: e.message || 'Възникна грешка при одобряване.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const rejectPet = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectPetPost(id);
      toast({
        title: 'Успешно',
        description: 'Домашният любимец е отхвърлен.',
      });
      await refetch();
      onRefresh?.();
    } catch (e: any) {
      toast({
        title: 'Грешка',
        description: e.message || 'Възникна грешка при отхвърляне.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <p>Зареждане...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Грешка при зареждане: {error.message}</p>;
  }

  if (pets.length === 0) {
    return <p className="text-center text-gray-500">Няма домашни любимци за преглед.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Заглавие</TableHead>
          <TableHead>Описание</TableHead>
          <TableHead>Изображение</TableHead>
          <TableHead>Добавен на</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pets.map((pet) => (
          <TableRow key={pet.id}>
            <TableCell>{pet.title}</TableCell>
            <TableCell>
              <pre className="whitespace-pre-wrap max-w-xs">{pet.description}</pre>
            </TableCell>
            <TableCell>
              {pet.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pet.image_url} alt={pet.title} className="max-w-[80px] max-h-[60px] object-cover rounded" />
              ) : (
                <span>Няма</span>
              )}
            </TableCell>
            <TableCell>{new Date(pet.created_at).toLocaleDateString('bg-BG')}</TableCell>
            <TableCell>{pet.is_approved ? 'Одобрен' : 'В очакване'}</TableCell>
            <TableCell>
              {!pet.is_approved && (
                <Button 
                  variant="default" 
                  size="sm" 
                  disabled={processingId === pet.id} 
                  onClick={() => approvePet(pet.id)}
                >
                  Одобри
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                disabled={processingId === pet.id}
                onClick={() => rejectPet(pet.id)}
                className={pet.is_approved ? 'ml-2' : 'ml-1'}
              >
                {pet.is_approved ? 'Изтрий' : 'Отхвърли'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PetsTabContent;

