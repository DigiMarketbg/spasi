
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import RescuersTable from './rescuers/RescuersTable';

interface Rescuer {
  id: string;
  name: string;
  city: string;
  help_description: string;
  help_date: string;
  image_url?: string;
  created_at: string;
}

interface RescuersManagementProps {
  rescuers: Rescuer[];
  loadingRescuers: boolean;
  onRefresh: () => void;
}

const RescuersManagement = ({ rescuers, loadingRescuers, onRefresh }: RescuersManagementProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    help_description: '',
    help_date: '',
    image_url: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      help_description: '',
      help_date: '',
      image_url: ''
    });
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Валидация
      if (!formData.name || !formData.city || !formData.help_description || !formData.help_date) {
        toast({
          title: "Грешка",
          description: "Моля, попълнете всички задължителни полета",
          variant: "destructive"
        });
        return;
      }

      if (editingId) {
        // Обновяване на съществуващ запис
        const { error } = await supabase
          .from('rescuers')
          .update({
            name: formData.name,
            city: formData.city,
            help_description: formData.help_description,
            help_date: formData.help_date,
            image_url: formData.image_url || null
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Успешно обновяване",
          description: "Информацията за спасителя беше обновена"
        });
      } else {
        // Създаване на нов запис
        const { error } = await supabase
          .from('rescuers')
          .insert({
            name: formData.name,
            city: formData.city,
            help_description: formData.help_description,
            help_date: formData.help_date,
            image_url: formData.image_url || null
          });

        if (error) throw error;

        toast({
          title: "Успешно добавяне",
          description: "Спасителят беше добавен успешно"
        });
      }

      onRefresh();
      resetForm();
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (rescuer: Rescuer) => {
    // Форматиране на датата за input type="date"
    const date = new Date(rescuer.help_date);
    const formattedDate = date.toISOString().split('T')[0];

    setFormData({
      name: rescuer.name,
      city: rescuer.city,
      help_description: rescuer.help_description,
      help_date: formattedDate,
      image_url: rescuer.image_url || ''
    });
    setEditingId(rescuer.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този запис?')) {
      try {
        const { error } = await supabase
          .from('rescuers')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Успешно изтриване",
          description: "Записът беше изтрит успешно"
        });

        onRefresh();
      } catch (error: any) {
        toast({
          title: "Грешка",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Спасители</h2>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsOpen(true);
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Добави нов спасител
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Редактиране на запис' : 'Добавяне на нов спасител'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Име*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Име или инициали"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Град*</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Град"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="help_date">Дата на помощта*</Label>
                  <Input
                    id="help_date"
                    name="help_date"
                    type="date"
                    value={formData.help_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image_url">Снимка (URL)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="URL на снимка (по желание)"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="help_description">За какво е помогнал*</Label>
                <Textarea
                  id="help_description"
                  name="help_description"
                  value={formData.help_description}
                  onChange={handleInputChange}
                  placeholder="Кратко описание на помощта"
                  required
                  rows={4}
                />
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Отказ</Button>
                </DialogClose>
                <Button type="submit">{editingId ? 'Запази промените' : 'Добави'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <RescuersTable 
        rescuers={rescuers}
        isLoading={loadingRescuers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default RescuersManagement;
