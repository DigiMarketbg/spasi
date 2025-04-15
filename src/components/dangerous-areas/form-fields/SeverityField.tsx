
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { DangerousAreaFormValues } from '@/types/dangerous-area';

interface SeverityFieldProps {
  control: Control<DangerousAreaFormValues>;
}

const SeverityField = ({ control }: SeverityFieldProps) => {
  return (
    <FormField
      control={control}
      name="severity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Степен на опасност*</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Изберете степен на опасност" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="low">Ниска</SelectItem>
              <SelectItem value="medium">Средна</SelectItem>
              <SelectItem value="high">Висока</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Оценете колко опасен е участъкът
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SeverityField;
