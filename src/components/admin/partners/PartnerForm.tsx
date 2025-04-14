
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { uploadFile } from '@/lib/storage';
import { useState, useEffect, useRef } from 'react';
import { Partner } from '@/types/partner';

// Create a schema for partner form validation
const partnerFormSchema = z.object({
  company_name: z.string().min(2, { message: 'Името трябва да съдържа поне 2 символа' }),
  website_url: z.string().url({ message: 'Моля, въведете валиден URL' }).optional().or(z.literal('')),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

type PartnerFormProps = {
  onSubmit: (data: { company_name: string, logo_url: string, website_url?: string }) => Promise<void>;
  initialData?: Partial<Partner>;
  submitLabel?: string;
};

const PartnerForm = ({ onSubmit, initialData, submitLabel = 'Запази' }: PartnerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.logo_url || null);
  const [hasSelectedFile, setHasSelectedFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      company_name: initialData?.company_name || '',
      website_url: initialData?.website_url || '',
    },
  });

  const handleSubmit = async (data: PartnerFormData) => {
    try {
      setIsLoading(true);
      
      // Check for file
      const hasFile = fileInputRef.current?.files && fileInputRef.current.files.length > 0;
      
      // Debug logging
      console.log("Submit with file status:", {
        hasFile,
        hasSelectedFile,
        hasPreviewImage: !!previewImage,
        initialLogoUrl: initialData?.logo_url
      });
      
      // If we don't have a logo (neither an existing one nor a new upload), show an error
      if (!initialData?.logo_url && !hasFile) {
        toast({
          title: 'Грешка',
          description: 'Моля, качете лого за партньора',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      // If we have a new file, upload it
      let logoUrl = initialData?.logo_url;
      
      if (hasFile) {
        const file = fileInputRef.current!.files![0];
        console.log("Uploading file:", file.name, file.type, file.size);
        
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `partner_${Date.now()}.${fileExt}`;
        
        try {
          // Upload to the 'partners' bucket
          logoUrl = await uploadFile('partners', fileName, file);
          
          if (!logoUrl) {
            throw new Error('Error uploading logo');
          }
          console.log("File upload successful, URL:", logoUrl);
        } catch (uploadError: any) {
          console.error("File upload error:", uploadError);
          toast({
            title: 'Грешка при качване',
            description: uploadError.message || 'Възникна проблем при качването на логото. Моля, опитайте отново.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
      }
      
      // Submit the data to the parent component
      await onSubmit({
        company_name: data.company_name,
        logo_url: logoUrl || (previewImage as string),
        website_url: data.website_url || undefined,
      });
      
      // Reset the form if it's a new partner (no initialData)
      if (!initialData) {
        form.reset();
        setPreviewImage(null);
        setHasSelectedFile(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error: any) {
      console.error('Error submitting partner:', error);
      toast({
        title: 'Грешка',
        description: error.message || 'Възникна грешка при запазване на партньора',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      console.log("Selected file:", file.name, file.type, file.size);
      
      // Always set hasSelectedFile when file is selected
      setHasSelectedFile(true);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          console.log("Image preview created");
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Reset if file selection is canceled and no initial data
      if (!initialData?.logo_url) {
        setPreviewImage(null);
        setHasSelectedFile(false);
        console.log("File selection canceled, reset states");
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Име на компанията</FormLabel>
                  <FormControl>
                    <Input placeholder="Въведете име на компанията" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Уебсайт URL (незадължително)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>
                Лого {!initialData?.logo_url && <span className="text-destructive">*</span>}
              </FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="cursor-pointer"
                />
              </FormControl>
              
              {previewImage && (
                <div className="mt-2 bg-black/50 p-4 rounded-lg inline-block">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-16 w-auto object-contain" 
                  />
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-1">
                Препоръчителен размер: 200x80 пиксела (поддържат се всички размери)
              </p>
            </FormItem>
            
            <Button 
              type="submit" 
              disabled={isLoading || (!initialData?.logo_url && !hasSelectedFile)}
            >
              {isLoading ? 'Запазване...' : submitLabel}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PartnerForm;
