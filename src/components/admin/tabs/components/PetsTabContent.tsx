
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApprovedPetPosts, addPetPost } from '@/lib/api/pets';
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
  // We can extend this later for filters, loading props, etc.
  onRefresh?: () => void;
}

const PetsTabContent: React.FC<PetsTabContentProps> = ({ onRefresh }) => {
  const { toast } = useToast();
  const { data: pets = [], isLoading, refetch } = useQuery<PetPost[]>({
    queryKey: ['admin-pet-posts'],
    queryFn: async () => {
      // Ideally, we fetch all pet posts, including pending and approved
      // but fetchApprovedPetPosts only fetches approved.
      // Let's create a fetch function in API for all pet posts with status.
      const { data, error } = await fetchAllPetPosts();
      if (error) throw error;
      return data;
    }
  });

  // We'll implement approved/reject actions here
  const [processingId, setProcessingId] = useState<string | null>(null);

  const approvePet = async (id: string) => {
    setProcessingId(id);
    try {
      await approvePetPost(id);
      toast({
        title: 'Успешно',
        description: 'Домашният любимец е одобрен.',
      });
      refetch();
      if (onRefresh) onRefresh();
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
      refetch();
      if (onRefresh) onRefresh();
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
                <Button variant="default" size="sm" disabled={processingId === pet.id} onClick={() => approvePet(pet.id)}>
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

// Helper functions to use fetchAllPetPosts, approve and reject pet post API calls
async function fetchAllPetPosts(): Promise<[PetPost[], Error | null]> {
  // Fetch all pet posts regardless of approval, ordered newest first
  try {
    const res = await fetch('/api/admin/pet-posts');
    if (!res.ok) {
      throw new Error('Error fetching pet posts');
    }
    const data = await res.json();
    return [data, null];
  } catch (error: any) {
    return [[], error];
  }
}

async function approvePetPost(id: string): Promise<void> {
  const res = await fetch(`/api/admin/pet-posts/${id}/approve`, { method: 'POST' });
  if (!res.ok) throw new Error('Неуспешно одобрение');
}

async function rejectPetPost(id: string): Promise<void> {
  const res = await fetch(`/api/admin/pet-posts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Неуспешно отхвърляне');
}
