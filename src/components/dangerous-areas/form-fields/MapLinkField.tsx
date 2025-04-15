
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { Control } from 'react-hook-form';
import { DangerousAreaFormValues } from '@/types/dangerous-area';

interface MapLinkFieldProps {
  control: Control<DangerousAreaFormValues>;
}

const MapLinkField = ({ control }: MapLinkFieldProps) => {
  return (
    <FormField
      control={control}
      name="map_link"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> Връзка към карта
          </FormLabel>
          <FormControl>
            <Input 
              placeholder="Въведете линк към Google Maps или друга карта" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Добавете линк към точното местоположение в Google Maps
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MapLinkField;
