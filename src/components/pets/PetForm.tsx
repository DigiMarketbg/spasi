
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { addPetPost } from "@/lib/api/pets";

const petPostSchema = z.object({
  title: z.string().min(3, "Заглавието трябва да е поне 3 символа"),
  description: z.string().min(10, "Описанието трябва да е поне 10 символа"),
  imageUrl: z.string().url().optional().or(z.literal("")).or(z.undefined()),
});

type PetPostFormValues = z.infer<typeof petPostSchema>;

interface PetFormProps {
  onSuccess: () => void;
}

const PetForm: React.FC<PetFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PetPostFormValues>({
    resolver: zodResolver(petPostSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: PetPostFormValues) => {
    if (!user) {
      toast({
        title: "Грешка",
        description: "Трябва да сте влезли, за да добавите домашен любимец.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addPetPost(user.id, data.title, data.description, data.imageUrl?.trim() || null);
      toast({
        title: "Успешно изпратено",
        description: "Вашият домашен любимец беше изпратен и ще бъде одобрен скоро.",
      });
      reset();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна грешка при изпращането.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-4 bg-white rounded shadow">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Заглавие</label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Описание</label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Линк към изображение (по желание)</label>
        <Input id="imageUrl" {...register("imageUrl")} placeholder="https://..." />
        {errors.imageUrl && <p className="text-red-600 text-sm mt-1">{errors.imageUrl.message}</p>}
      </div>

      <div className="text-right">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Изпращане..." : "Добави домашен любимец"}
        </Button>
      </div>
    </form>
  );
};

export default PetForm;
