// Changed PetsTabContent to use supabase directly via lib/api/pets instead of fetch REST API

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { fetchAllPetPosts, PetPost } from "@/lib/api/pets";

interface PetsTabContentProps {
  onRefresh?: () => void;
}

// Use supabase client to fetch all pet posts without relying on REST API
// We assume fetchAllPetPosts fetches all posts regardless of approval

const PetsTabContent: React.FC<PetsTabContentProps> = ({ onRefresh }) => {
  const { toast } = useToast();
  const { data: pets = [], isLoading, error, refetch } = useQuery<PetPost[]>({
    queryKey: ["admin-pet-posts"],
    queryFn: fetchAllPetPosts,
  });

  const [processingId, setProcessingId] = useState<string | null>(null);

  const approvePetPost = async (id: string): Promise<void> => {
    // Call supabase function or REST API to approve. Keeping REST API here as it likely does backend logic.
    const res = await fetch(`/api/admin/pet-posts/${id}/approve`, { method: "POST" });
    if (!res.ok) throw new Error("Неуспешно одобрение");
  };

  const rejectPetPost = async (id: string): Promise<void> => {
    const res = await fetch(`/api/admin/pet-posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Неуспешно отхвърляне");
  };

  const approvePet = async (id: string) => {
    setProcessingId(id);
    try {
      await approvePetPost(id);
      toast({
        title: "Успешно",
        description: "Домашният любимец е одобрен.",
      });
      await refetch();
      onRefresh?.();
    } catch (e: any) {
      toast({
        title: "Грешка",
        description: e.message || "Възникна грешка при одобряване.",
        variant: "destructive",
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
        title: "Успешно",
        description: "Домашният любимец е отхвърлен.",
      });
      await refetch();
      onRefresh?.();
    } catch (e: any) {
      toast({
        title: "Грешка",
        description: e.message || "Възникна грешка при отхвърляне.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <p>Зареждане...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Грешка при зареждане: {(error as Error).message}</p>;
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
            <TableCell>{new Date(pet.created_at).toLocaleDateString("bg-BG")}</TableCell>
            <TableCell>{pet.is_approved ? "Одобрен" : "В очакване"}</TableCell>
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
                className={pet.is_approved ? "ml-2" : "ml-1"}
              >
                {pet.is_approved ? "Изтрий" : "Отхвърли"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PetsTabContent;
