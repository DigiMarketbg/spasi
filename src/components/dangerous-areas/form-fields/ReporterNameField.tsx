
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { DangerousAreaFormValues } from '@/types/dangerous-area';

interface ReporterNameFieldProps {
  control: Control<DangerousAreaFormValues>;
}

const ReporterNameField = ({ control }: ReporterNameFieldProps) => {
  return (
    <FormField
      control={control}
      name="reported_by_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Вашето име</FormLabel>
          <FormControl>
            <Input placeholder="Въведете вашето име (незадължително)" {...field} />
          </FormControl>
          <FormDescription>
            Името ви ще бъде показано като докладвано от вас (незадължително)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReporterNameField;
