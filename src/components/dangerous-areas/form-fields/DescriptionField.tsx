
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';
import { DangerousAreaFormValues } from '@/types/dangerous-area';

interface DescriptionFieldProps {
  control: Control<DangerousAreaFormValues>;
}

const DescriptionField = ({ control }: DescriptionFieldProps) => {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Описание*</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Въведете подробно описание на опасния участък" 
              {...field} 
              rows={5}
            />
          </FormControl>
          <FormDescription>
            Подробно опишете опасността - какъв е пътят, какви опасности има, и др.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionField;
