
import { z } from 'zod';

// Phone regex for Bulgarian numbers
const phoneRegex = /^(\+359|0)[0-9]{9}$/;

export const formSchema = z.object({
  category: z.string({
    required_error: "Моля, изберете категория",
  }),
  title: z.string()
    .min(5, { message: "Заглавието трябва да е поне 5 символа" })
    .max(100, { message: "Заглавието не може да надвишава 100 символа" }),
  city: z.string()
    .min(2, { message: "Моля, въведете град" })
    .max(50, { message: "Името на града е твърде дълго" }),
  description: z.string()
    .min(20, { message: "Описанието трябва да е поне 20 символа" })
    .max(2000, { message: "Описанието не може да надвишава 2000 символа" }),
  link: z.string()
    .url({ message: "Моля, въведете валиден URL адрес" })
    .optional()
    .or(z.literal('')),
  imageUrl: z.string()
    .url({ message: "Моля, въведете валиден URL адрес на изображение" })
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(phoneRegex, { message: "Невалиден телефонен номер. Пример: 0888123456 или +359888123456" })
    .optional()
    .or(z.literal(''))
});

export type FormValues = z.infer<typeof formSchema>;
