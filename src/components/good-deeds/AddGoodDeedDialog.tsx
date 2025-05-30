
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { addGoodDeed } from "@/lib/api/good-deeds";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/components/AuthProvider';

interface AddGoodDeedDialogProps {
  onAdd: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddGoodDeedDialog = ({
  onAdd,
  open,
  onOpenChange
}: AddGoodDeedDialogProps) => {
  const { profile, user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile?.full_name) {
      setAuthorName(profile.full_name);
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Не сте влезли в профила си",
        description: "Моля, влезте в профила си, за да регистрирате добро дело.",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Моля, въведете заглавие."
      });
      return;
    }

    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Моля, въведете описание."
      });
      return;
    }

    try {
      setIsLoading(true);
      const name = isAnonymous ? undefined : authorName;
      await addGoodDeed(description, name, title);
      toast({
        title: "Благодарим ви!",
        description: "Вашето добро дело беше регистрирано успешно."
      });
      onAdd();
      if (isControlled) {
        onOpenChange(false);
      } else {
        setInternalOpen(false);
      }
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: error instanceof Error ? error.message : "Възникна грешка при регистриране на доброто дело."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    if (profile?.full_name) {
      setAuthorName(profile.full_name);
    } else {
      setAuthorName("");
    }
    setIsAnonymous(false);
  };

  const handleOpenChange = (openState: boolean) => {
    if (isControlled) {
      onOpenChange(openState);
    } else {
      setInternalOpen(openState);
    }
    if (!openState) {
      resetForm();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Опишете доброто дело</DialogTitle>
          <DialogDescription>
            Споделете доброто дело, което направихте днес
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="authorName">Вашето име</Label>
            <Input id="authorName" value={authorName} readOnly className="bg-[#1A1F2C] text-white" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isAnonymous" checked={isAnonymous} onCheckedChange={checked => setIsAnonymous(checked === true)} />
            <Label htmlFor="isAnonymous" className="cursor-pointer">Публикувай анонимно</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Заглавие</Label>
            <Input id="title" placeholder="Въведете заглавие" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" placeholder="Опишете накратко какво добро направихте днес..." value={description} onChange={e => setDescription(e.target.value)} className="min-h-[100px]" />
          </div>

          <Button onClick={handleSubmit} disabled={isLoading || !title.trim() || !description.trim()} className="w-full bg-[#ea384c] hover:bg-[#c52c3f] text-white">
            Регистрирай
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoodDeedDialog;
