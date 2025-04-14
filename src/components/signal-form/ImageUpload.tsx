
import React, { useRef, useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Моля, качете валиден файл с изображение");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Размерът на файла трябва да е по-малък от 5MB");
      return;
    }
    
    // Reset error if validation passes
    setError(null);
    
    // Pass the file to parent component
    onImageChange(e);
  };

  return (
    <div className="space-y-3">
      <FormLabel htmlFor="image">Снимка (по избор)</FormLabel>
      <div className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!imagePreview && (
          <div 
            onClick={handleClick}
            className={`flex flex-col items-center gap-2 p-4 border-2 ${isUploading ? 'border-primary/50' : 'border-dashed border-muted-foreground/50'} rounded-lg hover:bg-accent/20 transition-colors cursor-pointer`}
          >
            <Camera className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Качете снимка (до 5MB)</span>
            <Input
              id="image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
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
