
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { DangerousAreaFormValues } from '@/types/dangerous-area';

interface LocationFieldProps {
  control: Control<DangerousAreaFormValues>;
}

const LocationField = ({ control }: LocationFieldProps) => {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Местоположение*</FormLabel>
          <FormControl>
            <Input placeholder="Въведете местоположение" {...field} />
          </FormControl>
          <FormDescription>
            Посочете конкретното местоположение на опасния участък
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
