
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

      await addPetPost(user.id, data.title, fullDescription, data.imageUrl?.trim() || null);

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
      className="space-y-4 max-w-lg mx-auto p-6 bg-gray-900/90 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto mt-20"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Заглавие
        </label>
        <Input id="title" {...register("title")} className="bg-gray-800 text-gray-100 border-gray-700 focus:border-spasi-green focus:ring-spasi-green" />
        {errors.title && <p className="text-spasi-red text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="petType" className="block text-sm font-medium text-gray-300">
          Вид домашен любимец
        </label>
        <Select
          onValueChange={(value) => setValue("petType", value as "Куче" | "Котка" | "Друг")}
          value={petTypeValue}
        >
          <SelectTrigger id="petType" className="w-full bg-gray-800 text-gray-100 border border-gray-700 focus:border-spasi-green focus:ring-spasi-green" />
          <SelectValue placeholder="Изберете вид" />
          <SelectContent className="bg-gray-800 text-gray-100 border border-gray-700">
            <SelectItem value="Куче">Куче</SelectItem>
            <SelectItem value="Котка">Котка</SelectItem>
            <SelectItem value="Друг">Друг</SelectItem>
          </SelectContent>
        </Select>
        {errors.petType && <p className="text-spasi-red text-sm mt-1">{errors.petType.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Описание
        </label>
        <Textarea
          id="description"
          rows={4}
          {...register("description")}
          className="bg-gray-800 text-gray-100 border border-gray-700 focus:border-spasi-green focus:ring-spasi-green"
        />
        {errors.description && <p className="text-spasi-red text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-300">
          Град
        </label>
        <Input id="city" {...register("city")} className="bg-gray-800 text-gray-100 border-gray-700 focus:border-spasi-green focus:ring-spasi-green" />
        {errors.city && <p className="text-spasi-red text-sm mt-1">{errors.city.message}</p>}
      </div>

      <div>
        <label htmlFor="contactName" className="block text-sm font-medium text-gray-300">
          Име за връзка
        </label>
        <Input id="contactName" {...register("contactName")} className="bg-gray-800 text-gray-100 border-gray-700 focus:border-spasi-green focus:ring-spasi-green" />
        {errors.contactName && <p className="text-spasi-red text-sm mt-1">{errors.contactName.message}</p>}
      </div>

      <div>
        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-300">
          Телефон за връзка
        </label>
        <Input id="contactPhone" {...register("contactPhone")} className="bg-gray-800 text-gray-100 border-gray-700 focus:border-spasi-green focus:ring-spasi-green" />
        {errors.contactPhone && <p className="text-spasi-red text-sm mt-1">{errors.contactPhone.message}</p>}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300">
          Линк към изображение (по желание)
        </label>
        <Input id="imageUrl" {...register("imageUrl")} placeholder="https://..." className="bg-gray-800 text-gray-100 border-gray-700 focus:border-spasi-green focus:ring-spasi-green" />
        {errors.imageUrl && <p className="text-spasi-red text-sm mt-1">{errors.imageUrl.message}</p>}
      </div>

      <div className="text-right">
        <Button type="submit" disabled={isSubmitting} variant="default" size="default">
          {isSubmitting ? "Изпращане..." : "Добави домашен любимец"}
        </Button>
      </div>
    </form>
  );
};

export default PetForm;
