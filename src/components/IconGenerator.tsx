
import React, { useEffect, useRef } from 'react';

const IconGenerator: React.FC = () => {
  const canvasRef192 = useRef<HTMLCanvasElement>(null);
  const canvasRef512 = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const logo = new Image();
    logo.src = '/lovable-uploads/6ae889da-fa60-4bae-9811-a9f6c34c7166.png'; // Use the newly uploaded logo
    logo.onload = () => {
      // Generate 192x192 icon
      if (canvasRef192.current) {
        const ctx = canvasRef192.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 192, 192);
          // Draw with padding to make sure logo fits nicely
          const size = Math.min(logo.width, logo.height) * 0.9;
          const xOffset = (192 - size) / 2;
          const yOffset = (192 - size) / 2;
          ctx.drawImage(logo, 0, 0, logo.width, logo.height, xOffset, yOffset, size, size);
          
          // Save as PNG
          const dataUrl = canvasRef192.current.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = dataUrl;
          downloadLink.download = 'icon-192.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      }
      
      // Generate 512x512 icon
      if (canvasRef512.current) {
        const ctx = canvasRef512.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 512, 512);
          // Draw with padding
          const size = Math.min(logo.width, logo.height) * 0.9;
          const xOffset = (512 - size * (512/192)) / 2;
          const yOffset = (512 - size * (512/192)) / 2;
          ctx.drawImage(logo, 0, 0, logo.width, logo.height, xOffset, yOffset, size * (512/192), size * (512/192));
          
          // Save as PNG
          const dataUrl = canvasRef512.current.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = dataUrl;
          downloadLink.download = 'icon-512.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      }
    };
  }, []);

  return (
    <div style={{ display: 'none' }}>
      <canvas ref={canvasRef192} width="192" height="192"></canvas>
      <canvas ref={canvasRef512} width="512" height="512"></canvas>
      <img ref={logoRef} alt="Logo reference" />
    </div>
  );
};

export default IconGenerator;
