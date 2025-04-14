
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { Camera } from 'lucide-react';

interface ImageUploadProps {
  imagePreview: string | null;
  isUploading: boolean;
  uploadProgress: number;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

const ImageUpload = ({ 
  imagePreview, 
  isUploading, 
  uploadProgress, 
  onImageChange, 
  onImageRemove 
}: ImageUploadProps) => {
  return (
    <div className="space-y-3">
      <FormLabel htmlFor="image">Снимка (по избор)</FormLabel>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-muted-foreground/50 rounded-lg hover:bg-accent/20 transition-colors cursor-pointer">
          <Camera className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Качете снимка (до 10MB)</span>
          <Input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
            disabled={isUploading}
          />
        </label>
        
        {imagePreview && (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Преглед" 
              className="rounded-lg max-h-[200px] w-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onImageRemove}
              disabled={isUploading}
            >
              Премахни
            </Button>
          </div>
        )}
        
        {isUploading && (
          <div className="w-full bg-muted rounded-full h-2.5 mt-2">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
