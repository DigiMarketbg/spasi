
import React from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Partner interface matching Supabase schema
interface Partner {
  id: string;
  company_name: string;
  logo_url: string;
  website_url?: string | null;
}

const PartnerCarousel = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch partners from Supabase
  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .not('website_url', 'is', null);  // Changed to filter non-null website URLs
      
      if (error) {
        console.error('Error fetching partners:', error);
        return [];
      }
      return data || [];
    }
  });

  // Partner Request Form
  const { register, handleSubmit, reset } = useForm();

  const onSubmitPartnerRequest = async (formData: any) => {
    try {
      const { data, error } = await supabase
        .from('partners_requests')
        .insert({
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          logo_url: formData.logoUrl || null
        });

      if (error) throw error;

      toast({
        title: "Заявката е изпратена успешно",
        description: "Благодарим ви, че се интересувате да станете наш партньор!",
      });

      reset();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Грешка при изпращане на заявката",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <section className="py-10 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium text-muted-foreground">Нашите партньори</h2>
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
          >
            Стани партньор
          </Button>
        </div>
        
        <div className="relative w-full">
          <div className="overflow-hidden">
            <div className="flex gap-8 animate-slide-left">
              {[...partners, ...partners].map((partner, index) => (
                <div 
                  key={`${partner.id}-${index}`} 
                  className={cn(
                    "flex-shrink-0 h-16 w-32 glass rounded-lg flex items-center justify-center",
                    "hover:border-primary/50 transition-all duration-300"
                  )}
                >
                  <span className="font-medium">{partner.company_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Станете партньор</DialogTitle>
              <DialogDescription>
                Попълнете формата, за да изпратите заявка за партньорство.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitPartnerRequest)} className="space-y-4">
              <div>
                <Label>Име на фирмата</Label>
                <Input {...register('companyName', { required: true })} placeholder="Въведете име на фирмата" />
              </div>
              <div>
                <Label>Име на контактно лице</Label>
                <Input {...register('contactPerson', { required: true })} placeholder="Въведете име" />
              </div>
              <div>
                <Label>Имейл</Label>
                <Input {...register('email', { required: true })} type="email" placeholder="Въведете имейл" />
              </div>
              <div>
                <Label>Телефон</Label>
                <Input {...register('phone')} placeholder="Въведете телефон" />
              </div>
              <div>
                <Label>Съобщение</Label>
                <Textarea {...register('message')} placeholder="Кратко описание/предложение" />
              </div>
              <div>
                <Label>Лого (по избор)</Label>
                <Input {...register('logoUrl')} placeholder="URL на логото" />
              </div>
              <Button type="submit" className="w-full">Изпрати заявка</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PartnerCarousel;
