
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WitnessFormValues } from '@/types/witness';

interface WitnessFormProps {
  form: UseFormReturn<WitnessFormValues>;
}

const WitnessForm: React.FC<WitnessFormProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Заглавие*</FormLabel>
            <FormControl>
              <Input 
                placeholder="Въведете заглавие на обявата" 
                {...field}
              />
            </FormControl>
            <FormDescription>
              Кратко заглавие описващо инцидента или какви свидетели търсите
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Описание*</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Опишете инцидента или информацията, която търсите или споделяте" 
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Подробно описание на случилото се, какво точно търсите или видяхте
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Местоположение*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Къде се е случил инцидентът" 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Адрес, район или местност, където е бил инцидентът
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата на инцидента*</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Кога се е случил инцидентът
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Лице за контакт*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Въведете име за контакт" 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Вашето име или име на лице за контакт
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Телефон за връзка (по желание)" 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Телефонен номер, на който могат да се свържат с вас
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default WitnessForm;
