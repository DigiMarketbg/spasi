
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOneSignal } from './OneSignalProvider';

const NotificationDialog = () => {
  const [open, setOpen] = useState(false);
  const { isSubscribed, isPushSupported, isInitialized, subscribe } = useOneSignal();
  
  useEffect(() => {
    // Only show if notifications are supported and user is not already subscribed
    if (!isPushSupported || isSubscribed || !isInitialized) {
      return;
    }
    
    // Check if we already showed the dialog before
    const hasShownDialog = localStorage.getItem('notification_dialog_shown');
    if (hasShownDialog) {
      return;
    }
    
    // Show dialog after 5 seconds
    const timer = setTimeout(() => {
      setOpen(true);
      // Mark as shown
      localStorage.setItem('notification_dialog_shown', 'true');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isPushSupported, isSubscribed, isInitialized]);
  
  const handleSubscribe = async () => {
    await subscribe();
    setOpen(false);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  // Don't render anything if notifications are not supported or already subscribed
  if (!isPushSupported || isSubscribed || !isInitialized) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-spasi-red" />
            Абонирайте се за известия
          </DialogTitle>
          <DialogDescription>
            Получавайте известия за нови сигнали и важна информация от Spasi.bg
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-2">
            Абонирайте се, за да:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Получавате известия за нови сигнали във вашия град</li>
            <li>Бъдете информирани за спешни случаи</li>
            <li>Не пропускате възможности да помогнете</li>
          </ul>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose}>
            По-късно
          </Button>
          <Button 
            className="bg-spasi-red hover:bg-spasi-red/90 text-white"
            onClick={handleSubscribe}
          >
            Абониране за известия
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
