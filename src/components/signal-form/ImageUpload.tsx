
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { Camera, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-3">
      <FormLabel htmlFor="image">Снимка (по избор)</FormLabel>
      <div className="flex flex-col gap-4">
        {!imagePreview && (
          <div 
            onClick={handleClick}
            className={`flex flex-col items-center gap-2 p-4 border-2 ${isUploading ? 'border-primary/50' : 'border-dashed border-muted-foreground/50'} rounded-lg hover:bg-accent/20 transition-colors cursor-pointer`}
          >
            <Camera className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Качете снимка (до 20MB)</span>
            <Input
              id="image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
              disabled={isUploading}
            />
          </div>
        )}
        
        {imagePreview && (
          <div className="relative border rounded-lg overflow-hidden">
            <img 
              src={imagePreview} 
              alt="Преглед" 
              className="rounded-lg max-h-[200px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
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
          </div>
        )}
        
        {isUploading && (
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Качване: {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
