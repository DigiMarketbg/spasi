
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { HELP_OPTIONS, BULGARIAN_CITIES } from '@/types/volunteer';

export const PersonalInfoFields = () => {
  const { control } = useFormContext();
  
  return (
    <>
      <FormField
        control={control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Име</FormLabel>
            <FormControl>
              <Input placeholder="Въведете пълното си име" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Имейл</FormLabel>
            <FormControl>
              <Input type="email" placeholder="example@mail.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Телефон (по желание)</FormLabel>
            <FormControl>
              <Input placeholder="+359 89 123 4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export const LocationField = () => {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Град</FormLabel>
          <FormControl>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              {...field}
              defaultValue=""
            >
              <option value="" disabled>Изберете град</option>
              {BULGARIAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const HelpOptionsField = () => {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name="can_help_with"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>В какво можете да помагате</FormLabel>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {HELP_OPTIONS.map((option) => (
              <FormField
                key={option.id}
                control={control}
                name="can_help_with"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== option.id
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const MotivationField = () => {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name="motivation"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Мотивация (по желание)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Защо искате да станете доброволец? Какви са вашите умения и опит?"
              className="min-h-[120px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
