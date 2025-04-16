
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const IconGenerator: React.FC = () => {
  const canvasRef192 = useRef<HTMLCanvasElement>(null);
  const canvasRef512 = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const generateIcons = () => {
    setIsGenerating(true);
    setIsGenerated(false);
    
    const logo = new Image();
    logo.crossOrigin = "anonymous"; // Enable cross-origin image loading
    logo.src = '/lovable-uploads/2b23da05-1088-41a2-800e-5cda238a09d9.png'; // Use the uploaded logo
    
    logo.onload = () => {
      try {
        // Generate 192x192 icon
        if (canvasRef192.current) {
          const ctx = canvasRef192.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 192, 192);
            // Fill with black background instead of white
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 192, 192);
            
            // Draw with padding to make sure logo fits nicely
            const size = Math.min(logo.width, logo.height) * 0.8;
            const xOffset = (192 - size) / 2;
            const yOffset = (192 - size) / 2;
            ctx.drawImage(logo, 0, 0, logo.width, logo.height, xOffset, yOffset, size, size);
          }
        }
        
        // Generate 512x512 icon
        if (canvasRef512.current) {
          const ctx = canvasRef512.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 512, 512);
            // Fill with black background instead of white
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 512, 512);
            
            // Draw with padding
            const size = Math.min(logo.width, logo.height) * 0.8;
            const scale = 512 / 192;
            const xOffset = (512 - size * scale) / 2;
            const yOffset = (512 - size * scale) / 2;
            ctx.drawImage(logo, 0, 0, logo.width, logo.height, xOffset, yOffset, size * scale, size * scale);
          }
        }
        
        setIsGenerated(true);
        setIsGenerating(false);
        toast({
          title: "Icons Generated Successfully",
          description: "Your PWA icons have been generated with a black background. Click the download buttons to save them.",
        });
      } catch (error) {
        console.error("Error generating icons:", error);
        setIsGenerating(false);
        toast({
          title: "Error Generating Icons",
          description: "There was a problem generating the icons. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    logo.onerror = () => {
      console.error("Error loading logo image");
      setIsGenerating(false);
      toast({
        title: "Error Loading Logo",
        description: "Could not load the logo image. Please check the image path.",
        variant: "destructive",
      });
    };
  };

  const downloadIcon = (size: string) => {
    const canvas = size === "192" ? canvasRef192.current : canvasRef512.current;
    if (canvas) {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = `icon-${size}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        toast({
          title: "Icon Downloaded",
          description: `The ${size}x${size} icon has been downloaded to your device.`,
        });
      } catch (error) {
        console.error(`Error downloading ${size}x${size} icon:`, error);
        toast({
          title: "Download Failed",
          description: `Failed to download the ${size}x${size} icon. Please try again.`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6 bg-card rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center">PWA Icon Generator</h2>
      
      <div className="flex justify-center">
        <Button 
          onClick={generateIcons}
          disabled={isGenerating}
          className="bg-spasi-red hover:bg-spasi-red/90"
        >
          {isGenerating ? "Generating..." : "Generate PWA Icons"}
        </Button>
      </div>
      
      {isGenerated && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg">
            <canvas ref={canvasRef192} width="192" height="192" className="border"></canvas>
            <p className="text-sm text-muted-foreground">192x192 Icon Preview</p>
            <Button onClick={() => downloadIcon("192")} variant="outline">
              Download 192x192 Icon
            </Button>
          </div>
          
          <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg">
            <canvas ref={canvasRef512} width="512" height="512" className="border"></canvas>
            <p className="text-sm text-muted-foreground">512x512 Icon Preview</p>
            <Button onClick={() => downloadIcon("512")} variant="outline">
              Download 512x512 Icon
            </Button>
          </div>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground mt-4">
        <p>After downloading the icons, place them in the public directory of your project with the names icon-192.png and icon-512.png.</p>
      </div>
    </div>
  );
};

export default IconGenerator;

