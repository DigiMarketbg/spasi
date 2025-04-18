
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SignalFormValues } from '@/types/signal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SignalFormProps {
  form: UseFormReturn<SignalFormValues>;
  onSubmit: (values: SignalFormValues) => Promise<void>;
  onCancel: () => void;
}

const SignalForm: React.FC<SignalFormProps> = ({ form, onSubmit, onCancel }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заглавие</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Изберете категория" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood">Нужда от кръводарители</SelectItem>
                      <SelectItem value="missing">Изчезнал човек</SelectItem>
                      <SelectItem value="stolen">Откраднат автомобил</SelectItem>
                      <SelectItem value="help">Хора в беда</SelectItem>
                      <SelectItem value="other">Друго</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Град</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон (опционално)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Линк (опционално)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Запази промените
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Отказ
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignalForm;
