
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { addPetPost } from "@/lib/api/pets";

const petPostSchema = z.object({
  title: z.string().min(3, "Заглавието трябва да е поне 3 символа"),
  petType: z.enum(["Куче", "Котка", "Друг"], { required_error: "Моля, изберете вид домашен любимец" }),
  description: z.string().min(10, "Описанието трябва да е поне 10 символа"),
  city: z.string().min(2, "Моля, въведете град"),
  contactName: z.string().min(2, "Моля, въведете име за връзка"),
  contactPhone: z.string().min(5, "Моля, въведете телефонен номер"),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PetPostFormValues>({
    resolver: zodResolver(petPostSchema),
    defaultValues: {
      title: "",
      petType: "Куче",
      description: "",
      city: "",
      contactName: "",
      contactPhone: "",
      imageUrl: "",
    },
  });

  // Watch petType to set controlled value for Select
  const petTypeValue = watch("petType");

  const onSubmit = async (data: PetPostFormValues) => {
    if (!user) {
      toast({
        title: "Не сте влезли в профила си",
        description: "Моля, влезте в профила си, за да добавите домашен любимец.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const fullDescription =
        `Вид: ${data.petType}\n` +
        `Град: ${data.city}\n` +
        `Име за връзка: ${data.contactName}\n` +
        `Телефон за връзка: ${data.contactPhone}\n\n` +
        data.description;

      await addPetPost(data.title, fullDescription, data.imageUrl?.trim() || null);

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-lg mx-auto p-6 bg-white rounded shadow max-h-[80vh] overflow-y-auto mt-20"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Заглавие
        </label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="petType" className="block text-sm font-medium text-gray-700">
          Вид домашен любимец
        </label>
        <Select
          onValueChange={(value) => setValue("petType", value as "Куче" | "Котка" | "Друг")}
          value={petTypeValue}
        >
          <SelectTrigger id="petType" className="w-full">
            <SelectValue placeholder="Изберете вид" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Куче">Куче</SelectItem>
            <SelectItem value="Котка">Котка</SelectItem>
            <SelectItem value="Друг">Друг</SelectItem>
          </SelectContent>
        </Select>
        {errors.petType && <p className="text-red-600 text-sm mt-1">{errors.petType.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Описание
        </label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          Град
        </label>
        <Input id="city" {...register("city")} />
        {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
      </div>

      <div>
        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
          Име за връзка
        </label>
        <Input id="contactName" {...register("contactName")} />
        {errors.contactName && <p className="text-red-600 text-sm mt-1">{errors.contactName.message}</p>}
      </div>

      <div>
        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
          Телефон за връзка
        </label>
        <Input id="contactPhone" {...register("contactPhone")} />
        {errors.contactPhone && <p className="text-red-600 text-sm mt-1">{errors.contactPhone.message}</p>}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Линк към изображение (по желание)
        </label>
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
