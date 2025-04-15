
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { DangerousAreaFormValues } from '@/types/dangerous-area';

interface RegionFieldProps {
  control: Control<DangerousAreaFormValues>;
}

const RegionField = ({ control }: RegionFieldProps) => {
  return (
    <FormField
      control={control}
      name="region"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Регион</FormLabel>
          <FormControl>
            <Input placeholder="Въведете регион" {...field} />
          </FormControl>
          <FormDescription>
            Област или град
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RegionField;
